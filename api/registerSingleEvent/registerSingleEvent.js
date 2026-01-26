module.exports = async function (context, req) {
  context.log("[registerSingleEvent] VALIDATION START");

  try {
    if (req.method !== "POST") {
      context.res = {
        status: 405,
        jsonBody: { error: "Method not allowed" },
      };
      return;
    }

    const body = req.body;

    if (!body) {
      context.res = {
        status: 400,
        jsonBody: { error: "Missing request body" },
      };
      return;
    }

    const errors = [];

    // -----------------------------
    // REQUIRED TOP-LEVEL FIELDS
    // -----------------------------
    if (!body.eventId) errors.push("eventId is required");
    if (!body.organizationId) errors.push("organizationId is required");

    // -----------------------------
    // SINGLE vs PRIMARY+COMPANION
    // -----------------------------
    const isCompanionRegistration = !!body.primary;

    if (!isCompanionRegistration) {
      // -------- SINGLE PLAYER --------
      if (!body.firstName) errors.push("firstName is required");
      if (!body.lastName) errors.push("lastName is required");
      if (!body.email) errors.push("email is required");
      if (!body.sex) errors.push("sex is required");

      if (body.player) {
        if (
          body.player.secondaryPosition &&
          !body.player.preferredPosition
        ) {
          errors.push(
            "secondaryPosition requires preferredPosition (primary)"
          );
        }
      }
    } else {
      // -------- PRIMARY + COMPANION --------
      const primary = body.primary;
      const companions = body.companions;

      if (!primary) errors.push("primary object is required");
      if (!Array.isArray(companions) || companions.length === 0) {
        errors.push("companions array is required");
      }

      if (primary) {
        if (!primary.firstName) errors.push("primary.firstName is required");
        if (!primary.lastName) errors.push("primary.lastName is required");
        if (!primary.email) errors.push("primary.email is required");
        if (!primary.sex) errors.push("primary.sex is required");

        if (
          primary.player?.secondaryPosition &&
          !primary.player?.preferredPosition
        ) {
          errors.push(
            "primary.secondaryPosition requires primary.preferredPosition"
          );
        }
      }

      if (Array.isArray(companions)) {
        companions.forEach((c, i) => {
          if (!c.firstName)
            errors.push(`companions[${i}].firstName is required`);
          if (!c.lastName)
            errors.push(`companions[${i}].lastName is required`);
          if (!c.email)
            errors.push(`companions[${i}].email is required`);
          if (!c.sex)
            errors.push(`companions[${i}].sex is required`);

          if (
            c.player?.secondaryPosition &&
            !c.player?.preferredPosition
          ) {
            errors.push(
              `companions[${i}].secondaryPosition requires preferredPosition`
            );
          }
        });
      }
    }

    // -----------------------------
    // RETURN VALIDATION RESULT
    // -----------------------------
    if (errors.length > 0) {
      context.res = {
        status: 400,
        jsonBody: {
          ok: false,
          errors,
        },
      };
      return;
    }

    context.res = {
      status: 200,
      jsonBody: {
        ok: true,
        message: "Payload validation passed",
      },
    };
  } catch (err) {
    context.log.error("[registerSingleEvent] VALIDATION ERROR", err);

    context.res = {
      status: 500,
      jsonBody: {
        ok: false,
        error: "Unhandled server error",
        detail: err.message,
      },
    };
  }
};
