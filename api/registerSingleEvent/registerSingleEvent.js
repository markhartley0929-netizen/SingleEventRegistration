const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("[registerSingleEvent] START");

  try {
    // Log request basics (keep this for now)
    context.log("Method:", req.method);
    context.log("Body:", req.body);

    // ---- PHASE 1: DB CONNECTIVITY TEST ONLY ----
    // No inserts, no updates, no deletes
    await sql.connect(process.env.SQL_CONNECTION_STRING);

    const result = await sql.query`SELECT 1 AS ok`;

    context.log("[registerSingleEvent] DB connected");

    context.res = {
      status: 200,
      jsonBody: {
        ok: true,
        db: "connected",
        test: result.recordset[0],
      },
    };
  } catch (err) {
    context.log.error("[registerSingleEvent] ERROR", err);

    context.res = {
      status: 500,
      jsonBody: {
        ok: false,
        error: "Database connection failed",
        detail: err.message,
      },
    };
  }
};
