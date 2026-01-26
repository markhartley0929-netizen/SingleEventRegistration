const sql = require("mssql");
const { randomUUID } = require("crypto");

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

async function ensureCompanionGroupExists(tx, companionGroupId) {
  await new sql.Request(tx)
    .input("CompanionGroupId", sql.UniqueIdentifier, companionGroupId)
    .query(`
      IF NOT EXISTS (
        SELECT 1 FROM dbo.CompanionGroups WHERE CompanionGroupId = @CompanionGroupId
      )
      INSERT INTO dbo.CompanionGroups (CompanionGroupId)
      VALUES (@CompanionGroupId)
    `);
}

async function upsertPlayer(tx, {
  firstName,
  lastName,
  email,
  sex,
  player,
  jerseySize,
  shortSize,
  pantSize,
  jerseyNumber,
  jerseyName,
  companionGroupId,
  isPrimaryRegistrant,
}) {
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
    .input("JerseySize", sql.NVarChar, jerseySize ?? null)
    .input("ShortSize", sql.NVarChar, shortSize ?? null)
    .input("PantSize", sql.NVarChar, pantSize ?? null)
    .input("JerseyNumber", sql.NVarChar, jerseyNumber ?? null)
    .input("JerseyName", sql.NVarChar, jerseyName ?? null)
    .input("CompanionGroupId", sql.UniqueIdentifier, companionGroupId ?? null)
    .input("IsPrimaryRegistrant", sql.Bit, isPrimaryRegistrant ? 1 : 0)
    .input("CreatedAt", sql.DateTime2, new Date())
    .query(`
      INSERT INTO dbo.Players (
        FirstName, LastName, Email, Sex,
        PreferredPosition, SecondaryPosition,
        SkillLevel,
        JerseySize, ShortSize, PantSize,
        JerseyNumber, JerseyName,
        CompanionGroupId, IsPrimaryRegistrant,
        CreatedAt
      )
      OUTPUT INSERTED.PlayerID
      VALUES (
        @FirstName, @LastName, @Email, @Sex,
        @PreferredPosition, @SecondaryPosition,
        @SkillLevel,
        @JerseySize, @ShortSize, @PantSize,
        @JerseyNumber, @JerseyName,
        @CompanionGroupId, @IsPrimaryRegistrant,
        @CreatedAt
      )
    `);

  return inserted.recordset[0].PlayerID;
}

async function guardDuplicateRegistration(tx, { eventId, playerId }) {
  const dup = await new sql.Request(tx)
    .input("EventId", sql.UniqueIdentifier, eventId)
    .input("PlayerId", sql.Int, playerId)
    .query(`
      SELECT 1
      FROM dbo.EventRegistrations WITH (UPDLOCK, HOLDLOCK)
      WHERE EventId = @EventId
        AND PlayerId = @PlayerId
    `);

  return dup.recordset.length > 0;
}

async function insertEventRegistration(tx, {
  eventId,
  playerId,
  organizationId,
  isPrimaryRegistrant,
}) {
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
  if (req.method !== "POST") {
    context.res = { status: 405 };
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch {}
  }

  if (!body || !body.eventId || !body.organizationId) {
    context.res = errorJson(ERROR_CODES.INVALID_INPUT, "Missing eventId or organizationId");
    return;
  }

  const isCompanion = !!body.primary;
  const registrants = [];

  if (!isCompanion) {
    registrants.push({
      ...body,
      isPrimaryRegistrant: true,
    });
  } else {
    registrants.push({ ...body.primary, isPrimaryRegistrant: true });
    for (const c of body.companions || []) {
      registrants.push({ ...c, isPrimaryRegistrant: false });
    }
  }

  let pool;
  try {
    pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

    const orgCheck = await pool.request()
      .input("OrganizationId", sql.UniqueIdentifier, body.organizationId)
      .query(`SELECT 1 FROM dbo.Organization WHERE OrganizationID = @OrganizationId`);

    if (!orgCheck.recordset.length) {
      context.res = errorJson(ERROR_CODES.ORG_NOT_FOUND, "Invalid organizationId");
      return;
    }

    const tx = new sql.Transaction(pool);
    await tx.begin();

    const companionGroupId = isCompanion ? randomUUID() : null;
    if (companionGroupId) {
      await ensureCompanionGroupExists(tx, companionGroupId);
    }

    const registrations = [];

    for (const r of registrants) {
      const playerId = await upsertPlayer(tx, {
        ...r,
        companionGroupId,
      });

      if (await guardDuplicateRegistration(tx, { eventId: body.eventId, playerId })) {
        await tx.rollback();
        context.res = errorJson(
          ERROR_CODES.DUPLICATE_REGISTRATION,
          "Player already registered",
          409
        );
        return;
      }

      const registrationId = await insertEventRegistration(tx, {
        eventId: body.eventId,
        playerId,
        organizationId: body.organizationId,
        isPrimaryRegistrant: r.isPrimaryRegistrant,
      });

      registrations.push({ playerId, registrationId });
    }

    await tx.commit();

    context.res = {
      status: 200,
      jsonBody: {
        ok: true,
        registrations,
        companionGroupId,
      },
    };
  } catch (err) {
    context.log.error(err);
    context.res = errorJson(ERROR_CODES.SQL_FAILURE, "Database failure", 500, {
      detail: err.message,
    });
  } finally {
    if (pool) try { await pool.close(); } catch {}
  }
};
