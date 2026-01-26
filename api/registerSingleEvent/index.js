




const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");


/* =========================
   HARD-CODED EVENT
========================= */
const EVENT_ID = "b04de545-5aee-4403-86b1-03db1e5c4a86";

/* =========================
   PAYMENT MODE
   'none' | 'optional' | 'required'
========================= */
const PAYMENT_MODE = "required";

/* =========================
   CORS HEADERS
========================= */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

module.exports = async function (context, req) {
  context.log.error("🚨 REGISTER CLICK HIT THIS FUNCTION 🚨");
  context.log("registerSingleEvent called", req.method);

  // -------------------------
// FORCE JSON BODY PARSE (SWA FIX)
// -------------------------
let body = req.body;

if (!body && req.rawBody) {
  try {
    body = JSON.parse(req.rawBody);
  } catch (err) {
    context.res = {
      status: 400,
      headers: corsHeaders,
      body: { error: "Invalid JSON body" },
    };
    return;
  }
}


  if (req.method === "OPTIONS") {
    context.res = { status: 204, headers: corsHeaders };
    return;
  }

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      headers: corsHeaders,
      body: { error: "Method not allowed" },
    };
    return;
  }

  try {
    const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

// -------------------------
// Normalize payload shapes
// -------------------------
let primary;
let companion = null;

if (body?.firstName && body?.lastName) {
  primary = body;
}
else if (body?.primary) {
  primary = body.primary;
  companion = body.companion || null;
} else {
  context.res = {
    status: 400,
    headers: corsHeaders,
    body: { error: "Invalid request payload" },
  };
  return;
}



if (
  !primary?.firstName ||
  !primary?.lastName ||
  !primary?.email
) {

      context.res = {
        status: 400,
        headers: corsHeaders,
        body: { error: "Missing required primary player fields" },
      };
      return;
    }

    /* =========================
       COMPANION GROUP
    ========================= */
    const companionGroupId = uuidv4();

    await pool.request()
      .input("CompanionGroupId", sql.UniqueIdentifier, companionGroupId)
      .query(`
        INSERT INTO CompanionGroups (CompanionGroupId)
        VALUES (@CompanionGroupId)
      `);

    /* =========================
       PLAYER INSERT
    ========================= */
    const insertPlayer = async (player, isPrimary) => {
      const result = await pool.request()
        .input("FirstName", sql.NVarChar, player.firstName)
        .input("LastName", sql.NVarChar, player.lastName)
        .input("Email", sql.NVarChar, player.email)
        .input("Sex", sql.NVarChar, player.sex || null)
        .input("SkillLevel", sql.NVarChar, player.skillLevel || null)
        .input("JerseySize", sql.NVarChar, player.jerseySize || null)
        .input("ShortSize", sql.NVarChar, player.shortSize || null)
        .input("AccessoryType", sql.NVarChar, player.accessoryType || null)
        .input("AccessorySize", sql.NVarChar, player.accessorySize || null)
        .input("JerseyNumber", sql.Int, player.jerseyNumber || null)
        .input("JerseyName", sql.NVarChar, player.jerseyName || null)
        .input("PreferredPosition", sql.NVarChar, player.preferredPosition || null)
        .input("SecondaryPosition", sql.NVarChar, player.secondaryPosition || null)
        .input("StreetAddress", sql.NVarChar, player.address?.street || null)
        .input("City", sql.NVarChar, player.address?.city || null)
        .input("State", sql.NVarChar, player.address?.state || null)
        .input("Zip", sql.NVarChar, player.address?.zip || null)
        .input("CompanionGroupId", sql.UniqueIdentifier, companionGroupId)
        .input("IsPrimaryRegistrant", sql.Bit, isPrimary)
        .query(`
          INSERT INTO Players (
            FirstName,
            LastName,
            Email,
            Sex,
            SkillLevel,
            JerseySize,
            ShortSize,
            AccessoryType,
            AccessorySize,
            JerseyNumber,
            JerseyName,
            PreferredPosition,
            SecondaryPosition,
            StreetAddress,
            City,
            State,
            Zip,
            CompanionGroupId,
            IsPrimaryRegistrant
          )
          OUTPUT INSERTED.*
          VALUES (
            @FirstName,
            @LastName,
            @Email,
            @Sex,
            @SkillLevel,
            @JerseySize,
            @ShortSize,
            @AccessoryType,
            @AccessorySize,
            @JerseyNumber,
            @JerseyName,
            @PreferredPosition,
            @SecondaryPosition,
            @StreetAddress,
            @City,
            @State,
            @Zip,
            @CompanionGroupId,
            @IsPrimaryRegistrant
          )
        `);

      return result.recordset[0];
    };

    /* =========================
       PRIMARY PLAYER
    ========================= */
    const primaryPlayer = await insertPlayer(primary, true);
    const primaryRegistrationId = uuidv4();

    await pool.request()
      .input("RegistrationID", sql.UniqueIdentifier, primaryRegistrationId)
      .input("EventID", sql.UniqueIdentifier, EVENT_ID)
      .input("PlayerID", sql.Int, primaryPlayer.PlayerID)
      .input("PaymentStatus", sql.NVarChar, "unpaid")
      .input("PaymentMode", sql.NVarChar, PAYMENT_MODE)
      .query(`
        INSERT INTO EventRegistrations (
          RegistrationID,
          EventID,
          PlayerID,
          PaymentStatus,
          PaymentMode
        )
        VALUES (
          @RegistrationID,
          @EventID,
          @PlayerID,
          @PaymentStatus,
          @PaymentMode
        )
      `);

    /* =========================
       COMPANION (OPTIONAL)
    ========================= */
    let companionResult = null;

    if (companion) {
      const companionPlayer = await insertPlayer(companion, false);
      const companionRegistrationId = uuidv4();

      await pool.request()
        .input("RegistrationID", sql.UniqueIdentifier, companionRegistrationId)
        .input("EventID", sql.UniqueIdentifier, EVENT_ID)
        .input("PlayerID", sql.Int, companionPlayer.PlayerID)
        .input("PaymentStatus", sql.NVarChar, "unpaid")
        .input("PaymentMode", sql.NVarChar, PAYMENT_MODE)
        .query(`
          INSERT INTO EventRegistrations (
            RegistrationID,
            EventID,
            PlayerID,
            PaymentStatus,
            PaymentMode
          )
          VALUES (
            @RegistrationID,
            @EventID,
            @PlayerID,
            @PaymentStatus,
            @PaymentMode
          )
        `);

      companionResult = {
        ...companionPlayer,
        registrationId: companionRegistrationId,
      };
    }

    /* =========================
       RESPONSE (PAYPAL READY)
    ========================= */
    context.res = {
      status: 201,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: {
        success: true,
        eventId: EVENT_ID,
        paymentMode: PAYMENT_MODE,
        primary: {
          ...primaryPlayer,
          registrationId: primaryRegistrationId,
        },
        companion: companionResult,
      },
    };
  } catch (err) {
    context.log.error("registerSingleEvent ERROR", err);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { error: "Database error", details: err.message },
    };
  }
};
