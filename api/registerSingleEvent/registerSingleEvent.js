const sql = require("mssql");

module.exports = async function (context, req) {
  context.log("[registerSingleEvent] START");

  try {
    // prove function is invoked
    context.log("Method:", req.method);
    context.log("Body:", req.body);

    context.res = {
      status: 200,
      jsonBody: {
        ok: true,
        source: "swa-managed-api",
        message: "registerSingleEvent reached successfully"
      }
    };
  } catch (err) {
    context.log.error("[registerSingleEvent] ERROR", err);

    context.res = {
      status: 500,
      jsonBody: {
        ok: false,
        error: "Unhandled server error"
      }
    };
  }
};
