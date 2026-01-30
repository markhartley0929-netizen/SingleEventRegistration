/**
 * Registration UI – Layout v1
 *
 * Layout structure locked.
 * Logic, validation, and flow may evolve without bumping layout version.
 */



import React, { useEffect, useMemo, useState } from "react";

import "../styles/register.css";



/* =========================
   Positions
========================= */
import { ALL_POSITIONS, Position } from "../constants/positions";

import { getSecondaryPositions } from "../utils/positionRules";

/* =========================
   Apparel Sizes
========================= */
import { ApparelSize, Gender } from "../constants/apparelSizes";
import { getVisibleApparelSizes } from "../utils/apparelSizeRules";



type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

const EMPTY_ADDRESS: Address = {
  street: "",
  city: "",
  state: "",
  zip: "",
};

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
] as const;

function validateZip(zip: string): string {
  if (!zip) return "";
  return /^\d{5}$/.test(zip) ? "" : "ZIP code must be 5 digits";
}

type PlayerRegistrationFormProps = {
  eventId: string;
};


export default function PlayerRegistrationForm({
  eventId,
}: PlayerRegistrationFormProps) {

  const [registeringWithCompanion, setRegisteringWithCompanion] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);




  const [primary, setPrimary] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sex: "" as Gender | "",
    skillLevel: "",
    jerseySize: "" as ApparelSize | "",
    shortSize: "" as ApparelSize | "",
    jerseyNumber: "",
    jerseyName: "",
    preferredPosition: "" as Position | "",
    secondaryPosition: "" as Position | "",
    address: { ...EMPTY_ADDRESS },
  });

  const [companion, setCompanion] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sex: "" as Gender | "",
    skillLevel: "",
    jerseySize: "" as ApparelSize | "",
    shortSize: "" as ApparelSize | "",
    jerseyNumber: "",
    jerseyName: "",
    preferredPosition: "" as Position | "",
    secondaryPosition: "" as Position | "",
    address: { ...EMPTY_ADDRESS },
  });

  // Inline zip errors (derived, not stored in payload)
  const primaryZipError = useMemo(
    () => validateZip(primary.address.zip),
    [primary.address.zip]
  );

  const companionZipError = useMemo(() => {
    if (!registeringWithCompanion) return "";
    if (useSameAddress) return ""; // hidden + synced; primary zip controls validity
    return validateZip(companion.address.zip);
  }, [companion.address.zip, registeringWithCompanion, useSameAddress]);

    // =========================
  // Front-end form guard
  // =========================
  const isPrimaryComplete = useMemo(() => {
  return (
    primary.firstName.trim() &&
    primary.lastName.trim() &&
    primary.email.trim() &&
    primary.sex &&
    primary.skillLevel &&
    primary.jerseySize &&
    primary.shortSize &&
    primary.preferredPosition &&          // ✅ REQUIRED
    primary.jerseyNumber.trim() &&         // ✅ REQUIRED
    primary.address.street.trim() &&
    primary.address.city.trim() &&
    primary.address.state &&
    primary.address.zip &&
    !primaryZipError
  );
}, [primary, primaryZipError]);

const isCompanionComplete = useMemo(() => {
  if (!registeringWithCompanion) return true;

  const addressOk =
    useSameAddress ||
    (
      companion.address.street.trim() &&
      companion.address.city.trim() &&
      companion.address.state &&
      companion.address.zip &&
      !companionZipError
    );

  return (
    companion.firstName.trim() &&
    companion.lastName.trim() &&
    companion.email.trim() &&
    companion.sex &&
    companion.skillLevel &&
    companion.jerseySize &&
    companion.shortSize &&
    companion.preferredPosition &&        // ✅ REQUIRED
    companion.jerseyNumber.trim() &&       // ✅ REQUIRED
    addressOk
  );
}, [companion, registeringWithCompanion, useSameAddress, companionZipError]);



const canSubmit =
  isPrimaryComplete &&
  (!registeringWithCompanion || isCompanionComplete) &&
  !submitting;





  // If companion registration is turned off, also turn off same-address toggle
  useEffect(() => {
    if (!registeringWithCompanion) {
      setUseSameAddress(false);
    }
  }, [registeringWithCompanion]);

  // Keep companion address synced when "same address" enabled
  useEffect(() => {
    if (registeringWithCompanion && useSameAddress) {
      setCompanion((c) => ({
        ...c,
        address: { ...primary.address },
      }));
    }
  }, [primary.address, registeringWithCompanion, useSameAddress]);

  const handlePrimaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1] as keyof Address;
      setPrimary((p) => ({
        ...p,
        address: { ...p.address, [field]: value },
      }));
      return;
    }

   const fieldName = name === "primarySex" ? "sex" : name;
setPrimary((p) => ({ ...p, [fieldName]: value }));

  };

  const handleCompanionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1] as keyof Address;
      setCompanion((c) => ({
        ...c,
        address: { ...c.address, [field]: value },
      }));
      return;
    }

    const fieldName = name === "companionSex" ? "sex" : name;
setCompanion((c) => ({ ...c, [fieldName]: value }));

  };

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

// -----------------------------
// HARD GUARD — NO SIDE EFFECTS
// -----------------------------
if (!canSubmit) {
  setAttemptedSubmit(true);
  return;
}

setSubmitting(true);



  // REQUIRED: backend expects this
  const organizationId = "d986892d-a116-40b2-98c5-d04e27648817";


  const primaryPayload = {
  firstName: primary.firstName,
  lastName: primary.lastName,
  email: primary.email,
  sex: primary.sex,

  jerseyNumber: primary.jerseyNumber || null,
  jerseyName: primary.jerseyName || null,

  address: {
    street: primary.address.street || null,
    city: primary.address.city || null,
    state: primary.address.state || null,
    zip: primary.address.zip || null,
  },

  player: {
    skillLevel: primary.skillLevel || null,
    jerseySize: primary.jerseySize || null,
    shortSize: primary.shortSize || null,
    preferredPosition: primary.preferredPosition || null,
    secondaryPosition: primary.secondaryPosition || null,
  },
};

const companionPayload = {
  firstName: companion.firstName,
  lastName: companion.lastName,
  email: companion.email,
  sex: companion.sex,

  jerseyNumber: companion.jerseyNumber || null,
  jerseyName: companion.jerseyName || null,

  address: useSameAddress
    ? primaryPayload.address
    : {
        street: companion.address.street || null,
        city: companion.address.city || null,
        state: companion.address.state || null,
        zip: companion.address.zip || null,
      },

  player: {
    skillLevel: companion.skillLevel || null,
    jerseySize: companion.jerseySize || null,
    shortSize: companion.shortSize || null,
    preferredPosition: companion.preferredPosition || null,
    secondaryPosition: companion.secondaryPosition || null,
  },
};

let payload;

// 🔒 This endpoint is PAIR-ONLY now
payload = registeringWithCompanion
  ? {
      organizationId,
      primary: primaryPayload,
      companion: companionPayload,
    }
  : {
      organizationId,
      primary: primaryPayload,
    };

setSubmitting(true);

try {
  const res = await fetch("/api/registerSingleEvent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });







  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // backend may return empty body
  }

if (res.ok) {
  const companionGroupId = data?.companionGroupId;

  const registrationIds: string[] =
    Array.isArray(data?.registrations)
      ? data.registrations
          .map((r: any) => r.registrationId)
          .filter(Boolean)
      : [];

  const paypalRes = await fetch("/api/paypalCreateOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hasCompanion: registeringWithCompanion,
    }),
  });

  const paypalData = await paypalRes.json();

  if (!paypalRes.ok || !paypalData?.approvalUrl) {
    alert(
      "Unable to start payment. Your registration was saved — please try again or contact support."
    );
    return;
  }

await fetch("/api/attachPayPalOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: paypalData.orderId,
      registrationIds,
    }),
  });

  window.location.href = paypalData.approvalUrl;
  return;
}

if (res.status === 409) {
  alert("ℹ️ You are already registered for this event");
  return;
}

alert(data?.message || "Registration failed");






  if (res.status === 409) {
    alert("ℹ️ You are already registered for this event");
    return;
  }

  alert(data?.message || "Registration failed");
} finally {
  setSubmitting(false);
}

};


  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Slowpitch Softball Registration</h1>

        <h2>Primary Player</h2>

        {attemptedSubmit && !isPrimaryComplete && (
  <div style={{ color: "#c62828", fontSize: 13, marginBottom: 8 }}>
    All primary player fields are required.
  </div>
)}



        <input name="firstName" placeholder="First Name" value={primary.firstName} onChange={handlePrimaryChange} />
        <input name="lastName" placeholder="Last Name" value={primary.lastName} onChange={handlePrimaryChange} />
        <input name="email" placeholder="Email" value={primary.email} onChange={handlePrimaryChange} />

<div className="radio-row">
  <label>
    <input
      type="radio"
      name="primarySex"
      value="M"
      checked={primary.sex === "M"}
      onChange={handlePrimaryChange}
    />
    Male
  </label>

  <label>
    <input
      type="radio"
      name="primarySex"
      value="F"
      checked={primary.sex === "F"}
      onChange={handlePrimaryChange}
    />
    Female
  </label>
</div>


        <h3>Address</h3>

        <input
          name="address.street"
          placeholder="Street Address"
          value={primary.address.street}
          onChange={handlePrimaryChange}
        />
        <div className="form-row">
          <input
            name="address.city"
            placeholder="City"
            value={primary.address.city}
            onChange={handlePrimaryChange}
          />

          <select
            name="address.state"
            value={primary.address.state}
            onChange={handlePrimaryChange}
          >
            <option value="">State</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            name="address.zip"
            placeholder="Zip Code"
            value={primary.address.zip}
            onChange={handlePrimaryChange}
          />
        </div>

        {primaryZipError && (
          <div style={{ color: "#c62828", fontSize: 12, marginTop: 6 }}>
            {primaryZipError}
          </div>
        )}

        <select name="skillLevel" value={primary.skillLevel} onChange={handlePrimaryChange}>
          <option value="">Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <div className="form-row">
          <select name="jerseySize" value={primary.jerseySize} onChange={handlePrimaryChange}>
            <option value="">Jersey Size</option>
            {getVisibleApparelSizes(primary.sex).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select name="shortSize" value={primary.shortSize} onChange={handlePrimaryChange}>
            <option value="">Short Size</option>
            {getVisibleApparelSizes(primary.sex).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

       

        <input name="jerseyNumber" placeholder="Jersey Number" value={primary.jerseyNumber} onChange={handlePrimaryChange} />
        <input name="jerseyName" placeholder="Jersey Name" value={primary.jerseyName} onChange={handlePrimaryChange} />

        <select name="preferredPosition" value={primary.preferredPosition} onChange={handlePrimaryChange}>
          <option value="">Preferred Position</option>
          {ALL_POSITIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

  <select
  name="secondaryPosition"
  value={primary.secondaryPosition}
  onChange={handlePrimaryChange}
  disabled={!primary.preferredPosition}
>
  <option value="">Secondary Position</option>
  {primary.preferredPosition &&
    getSecondaryPositions(primary.preferredPosition).map((p) => (
      <option key={p} value={p}>{p}</option>
    ))}
</select>


        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={registeringWithCompanion}
            onChange={(e) => setRegisteringWithCompanion(e.target.checked)}
          />
          Registering with a companion player
        </label>

        {registeringWithCompanion && (
          <>
            <h2>Companion Player</h2>

            {attemptedSubmit && !isCompanionComplete && (
  <div style={{ color: "#c62828", fontSize: 13, marginBottom: 8 }}>
    All companion player fields are required.
  </div>
)}


            <input name="firstName" placeholder="First Name" value={companion.firstName} onChange={handleCompanionChange} />
            <input name="lastName" placeholder="Last Name" value={companion.lastName} onChange={handleCompanionChange} />
            <input name="email" placeholder="Email" value={companion.email} onChange={handleCompanionChange} />

            <div className="radio-row">
  <label>
    <input
      type="radio"
      name="companionSex"
      value="M"
      checked={companion.sex === "M"}
      onChange={handleCompanionChange}
    />
    Male
  </label>

  <label>
    <input
      type="radio"
      name="companionSex"
      value="F"
      checked={companion.sex === "F"}
      onChange={handleCompanionChange}
    />
    Female
  </label>
</div>


            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={useSameAddress}
                onChange={(e) => setUseSameAddress(e.target.checked)}
              />
              Use same address as primary player
            </label>

            {!useSameAddress && (
              <>
                <h3>Address</h3>

                <input
                  name="address.street"
                  placeholder="Street Address"
                  value={companion.address.street}
                  onChange={handleCompanionChange}
                />
                <div className="form-row">
                  <input
                    name="address.city"
                    placeholder="City"
                    value={companion.address.city}
                    onChange={handleCompanionChange}
                  />

                  <select
                    name="address.state"
                    value={companion.address.state}
                    onChange={handleCompanionChange}
                  >
                    <option value="">State</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <input
                    name="address.zip"
                    placeholder="Zip Code"
                    value={companion.address.zip}
                    onChange={handleCompanionChange}
                  />
                </div>

                {companionZipError && (
                  <div style={{ color: "#c62828", fontSize: 12, marginTop: 6 }}>
                    {companionZipError}
                  </div>
                )}
              </>
            )}

            
<select
  name="skillLevel"
  value={companion.skillLevel}
  onChange={handleCompanionChange}
>
  <option value="">Skill Level</option>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>



            <div className="form-row">
              <select name="jerseySize" value={companion.jerseySize} onChange={handleCompanionChange}>
                <option value="">Jersey Size</option>
                {getVisibleApparelSizes(companion.sex).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select name="shortSize" value={companion.shortSize} onChange={handleCompanionChange}>
                <option value="">Short Size</option>
                {getVisibleApparelSizes(companion.sex).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            

            <input name="jerseyNumber" placeholder="Jersey Number" value={companion.jerseyNumber} onChange={handleCompanionChange} />
            <input name="jerseyName" placeholder="Jersey Name" value={companion.jerseyName} onChange={handleCompanionChange} />

            <select name="preferredPosition" value={companion.preferredPosition} onChange={handleCompanionChange}>
              <option value="">Preferred Position</option>
              {ALL_POSITIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

     <select
  name="secondaryPosition"
  value={companion.secondaryPosition}
  onChange={handleCompanionChange}
  disabled={!companion.preferredPosition}
>
  <option value="">Secondary Position</option>
  {companion.preferredPosition &&
    getSecondaryPositions(companion.preferredPosition).map((p) => (
      <option key={p} value={p}>{p}</option>
    ))}
</select>

          </>
        )}

        {attemptedSubmit && !canSubmit && (
  <div
    style={{
      marginBottom: 12,
      color: "#c62828",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Please complete all required fields before registering.
  </div>
)}


<button
  type="submit"
  className="submit-btn"
  disabled={!canSubmit}
>
  Register
</button>




      </form>
    </div>
  );
}
