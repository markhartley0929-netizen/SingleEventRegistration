const sql = require("mssql");
const { randomUUID } = require("crypto");

// -----------------------------
// Error contract (kept similar)
// -----------------------------
const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  ORG_NOT_FOUND: "ORG_NOT_FOUND",
  DUPLICATE_REGISTRATION: "DUPLICATE_REGISTRATION",
  SQL_FAILURE: "SQL_FAILURE",
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function errorJson(code, message, status = 400, extra = {}) {
  return {
    status,
    jsonBody: { ok: false, code, message, ...extra },
  };
}

/**
 * Upsert-by-email (matches your prior behavior):
 * - If email exists => return existing PlayerID (no update)
 * - Else insert a new row with the fields your seed script proves exist
 */
async function upsertPlayer(tx, { firstName, lastName, email, sex, player, companionGroupId, isPrimaryRegistrant }) {
  const emailNorm = normalizeEmail(email);

  const existing = await new sql.Request(tx)
    .input("Email", sql.NVarChar, emailNorm)
    .query(`
      SELECT PlayerID
      FROM dbo.Players
      WHERE Email = @Email
    `);

  if (existing.recordset.length) {
    return existing.recordset[0].PlayerID;
  }

  const inserted = await new sql.Request(tx)
    .input("FirstName", sql.NVarChar, firstName)
    .input("LastName", sql.NVarChar, lastName)
    .input("Email", sql.NVarChar, emailNorm)
    .input("Sex", sql.NVarChar, sex)
    .input("PreferredPosition", sql.NVarChar, player?.preferredPosition ?? null)
    .input("SecondaryPosition", sql.NVarChar, player?.secondaryPosition ?? null)
    .input("SkillLevel", sql.NVarChar, player?.skillLevel ?? null)
    .input("CompanionGroupId", sql.UniqueIdentifier, companionGroupId ?? null)
    .input("IsPrimaryRegistrant", sql.Bit, isPrimaryRegistrant ? 1 : 0)
    .input("CreatedAt", sql.DateTime2, new Date())
    .query(`
      INSERT INTO dbo.Players (
        FirstName, LastName, Email, Sex,
        PreferredPosition, SecondaryPosition,
        SkillLevel, CompanionGroupId, IsPrimaryRegistrant,
        CreatedAt
      )
      OUTPUT INSERTED.PlayerID
      VALUES (
        @FirstName, @LastName, @Email, @Sex,
        @PreferredPosition, @SecondaryPosition,
        @SkillLevel, @CompanionGroupId, @IsPrimaryRegistrant,
        @CreatedAt
      )
    `);

  return inserted.recordset[0].PlayerID;
}

async function ensureCompanionGroupExists(tx, companionGroupId) {
  // Seed script inserts only the ID; do the same (idempotent)
  await new sql.Request(tx)
    .input("CompanionGroupId", sql.UniqueIdentifier, companionGroupId)
    .query(`
      IF NOT EXISTS (
        SELECT 1 FROM dbo.CompanionGroups WHERE CompanionGroupId = @CompanionGroupId
      )
      BEGIN
        INSERT INTO dbo.CompanionGroups (CompanionGroupId)
        VALUES (@CompanionGroupId)
      END
    `);
}

async function guardDuplicateRegistration(tx, { eventId, playerId }) {
  const dupCheck = await new sql.Request(tx)
    .input("EventId", sql.UniqueIdentifier, eventId)
    .input("PlayerId", sql.Int, playerId)
    .query(`
      SELECT 1
      FROM dbo.EventRegistrations WITH (UPDLOCK, HOLDLOCK)
      WHERE EventId = @EventId
        AND PlayerId = @PlayerId
    `);

  return dupCheck.recordset.length > 0;
}

async function insertEventRegistration(tx, { eventId, playerId, organizationId, isPrimaryRegistrant }) {
  const registrationId = randomUUID();

  await new sql.Request(tx)
    .input("RegistrationId", sql.UniqueIdentifier, registrationId)
    .input("EventId", sql.UniqueIdentifier, eventId)
    .input("PlayerId", sql.Int, playerId)
    .input("CreatedAt", sql.DateTime2, new Date())
    .input("IsPrimaryRegistrant", sql.Bit, isPrimaryRegistrant ? 1 : 0)
    .input("OrganizationId", sql.UniqueIdentifier, organizationId)
    .query(`
      INSERT INTO dbo.EventRegistrations (
        RegistrationId,
        EventId,
        PlayerId,
        CreatedAt,
        IsPrimaryRegistrant,
        OrganizationId
      )
      VALUES (
        @RegistrationId,
        @EventId,
        @PlayerId,
        @CreatedAt,
        @IsPrimaryRegistrant,
        @OrganizationId
      )
    `);

  return registrationId;
}

module.exports = async function (context, req) {
  context.log("[registerSingleEvent] START");

  if (req.method !== "POST") {
    context.res = { status: 405, jsonBody: { ok: false, message: "Method not allowed" } };
    return;
  }

  // -----------------------------
  // Parse body (SWA v3 can be object or string)
  // -----------------------------
  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    context.res = errorJson(ERROR_CODES.INVALID_INPUT, "Invalid JSON body", 400);
    return;
  }

  if (!body || typeof body !== "object") {
    context.res = errorJson(ERROR_CODES.INVALID_INPUT, "Missing JSON body", 400);
    return;
  }

  // -----------------------------
  // Detect single vs companion payload
  // Your frontend sends:
  // - single: { eventId, organizationId, firstName... , player: {...} }
  // - companion: { eventId, organizationId, primary: {...}, companions: [...] }
  // -----------------------------
  const isCompanionRegistration = !!body.primary;

  const eventId = body.eventId;
  const organizationId = body.organizationId;

  if (!eventId || !organizationId) {
    context.res = errorJson(ERROR_CODES.INVALID_INPUT, "eventId and organizationId are required", 400);
    return;
  }

  // Normalize into a list of registrants to process
  let registrants = [];

  if (!isCompanionRegistration) {
    const { firstName, lastName, email, sex, player = {} } = body;

    if (!firstName || !lastName || !email || !sex) {
      context.res = errorJson(ERROR_CODES.INVALID_INPUT, "Missing required fields", 400);
      return;
    }

    registrants = [
      {
        firstName,
        lastName,
        email,
        sex,
        player,
        isPrimaryRegistrant: true,
      },
    ];
  } else {
    const primary = body.primary;
    const companions = Array.isArray(body.companions) ? body.companions : [];

    if (!primary || companions.length === 0) {
      context.res = errorJson(ERROR_CODES.INVALID_INPUT, "primary + companions[] are required", 400);
      return;
    }

    const p = primary;
    if (!p.firstName || !p.lastName || !p.email || !p.sex) {
      context.res = errorJson(ERROR_CODES.INVALID_INPUT, "Missing required primary fields", 400);
      return;
    }

    // primary first
    registrants.push({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      sex: p.sex,
      player: p.player || {},
      isPrimaryRegistrant: true,
    });

    // companions
    for (let i = 0; i < companions.length; i++) {
      const c = companions[i];
      if (!c?.firstName || !c?.lastName || !c?.email || !c?.sex) {
        context.res = errorJson(
          ERROR_CODES.INVALID_INPUT,
          `Missing required fields for companions[${i}]`,
          400
        );
        return;
      }

      registrants.push({
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        sex: c.sex,
        player: c.player || {},
        isPrimaryRegistrant: false,
      });
    }
  }

  // -----------------------------
  // DB work (transactional)
  // -----------------------------
  let pool;
  try {
    pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

    // Validate organization exists (seed script uses dbo.Organization)
    const orgCheck = await pool
      .request()
      .input("OrganizationId", sql.UniqueIdentifier, organizationId)
      .query(`
        SELECT 1
        FROM dbo.Organization
        WHERE OrganizationID = @OrganizationId
      `);

    if (!orgCheck.recordset.length) {
      context.res = errorJson(ERROR_CODES.ORG_NOT_FOUND, "Invalid organizationId", 400);
      return;
    }

    const tx = new sql.Transaction(pool);
    await tx.begin();

    // If companion registration, generate a CompanionGroupId and ensure FK-safe row exists
    const companionGroupId = isCompanionRegistration ? randomUUID() : null;
    if (companionGroupId) {
      await ensureCompanionGroupExists(tx, companionGroupId);
    }

    const registrationsOut = [];

    for (const r of registrants) {
      const playerId = await upsertPlayer(tx, {
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        sex: r.sex,
        player: r.player,
        companionGroupId,
        isPrimaryRegistrant: r.isPrimaryRegistrant,
      });

      // Duplicate guard per (EventId, PlayerId)
      const isDup = await guardDuplicateRegistration(tx, { eventId, playerId });
      if (isDup) {
        await tx.rollback();
        context.res = errorJson(
          ERROR_CODES.DUPLICATE_REGISTRATION,
          "Player is already registered for this event",
          409
        );
        return;
      }

      const registrationId = await insertEventRegistration(tx, {
        eventId,
        playerId,
        organizationId,
        isPrimaryRegistrant: r.isPrimaryRegistrant,
      });

      registrationsOut.push({ playerId, registrationId });
    }

    await tx.commit();

    context.res = {
      status: 200,
      jsonBody: {
        ok: true,
        registrations: registrationsOut,
        companionGroupId: companionGroupId || null,
      },
    };
  } catch (err) {
    context.log.error("[registerSingleEvent] FAILED", err);

    context.res = errorJson(ERROR_CODES.SQL_FAILURE, "Database operation failed", 500, {
      detail: err.message,
    });
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch {}
    }
  }
};
