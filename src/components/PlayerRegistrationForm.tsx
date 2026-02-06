/**
 * Registration UI – Layout v1
 *
 * Layout structure locked.
 * Logic, validation, and flow may evolve without bumping layout version.
 */



import React, { useEffect, useMemo, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";



import "../styles/register.css";



/* =========================
   Positions
========================= */
import { ALL_POSITIONS, Position } from "../constants/positions";

import { getSecondaryPositions } from "../utils/positionRules";

/* =========================
   Apparel Sizes
========================= */
import {
  ApparelSize,
  Gender,
  MEN_APPAREL_SIZES,
} from "../constants/apparelSizes";

import { getVisibleApparelSizes } from "../utils/apparelSizeRules";
import paypalLogo from "../assets/paypal-wordmark.svg";







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
  const [isReadyToPay, setIsReadyToPay] = useState(false);
const [savedRegIds, setSavedRegIds] = useState<string[]>([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);


  








const [primary, setPrimary] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  sex: "" as Gender | "",
  skillLevel: "",
  jerseySize: "" as ApparelSize | "",
  shortSize: "" as ApparelSize | "",
  jerseyNumber: "",
  jerseyName: "",
  preferredPosition: "" as Position | "",
  secondaryPosition: "" as Position | "",
  address: { ...EMPTY_ADDRESS },

  // ✅ OPTIONAL — PRIMARY PLAYER ONLY
  repCode: "",
});


  const [companion, setCompanion] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // ← ADD
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
    primary.phone.trim() &&
    primary.sex &&
    primary.skillLevel &&
    primary.jerseySize &&
    primary.shortSize &&
    primary.preferredPosition &&
    primary.secondaryPosition &&           
    primary.jerseyNumber.trim() &&
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
    companion.phone.trim() &&
    companion.sex &&
    companion.skillLevel &&
    companion.jerseySize &&
    companion.shortSize &&
    companion.preferredPosition &&
    companion.secondaryPosition &&        
    companion.jerseyNumber.trim() &&
    addressOk
  );
}, [companion, registeringWithCompanion, useSameAddress, companionZipError]);





const canSubmit =
  isPrimaryComplete &&
  (!registeringWithCompanion || isCompanionComplete) &&
  !submitting;




  const showIncompleteHint =
  !canSubmit &&
  !submitting &&
  !attemptedSubmit;






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

    if (submitting) return;
    if (!canSubmit) {
      setAttemptedSubmit(true);
      return;
    }

    setSubmitting(true);
    const organizationId = "d986892d-a116-40b2-98c5-d04e27648817";

    const primaryPayload = {
      firstName: primary.firstName,
      lastName: primary.lastName,
      email: primary.email,
      phone: primary.phone || null,
      sex: primary.sex,
      repCode: primary.repCode?.trim() || null,
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
      phone: companion.phone || null,
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

    const payload = registeringWithCompanion
      ? { organizationId, primary: primaryPayload, companion: companionPayload }
      : { organizationId, primary: primaryPayload };

    try {
      const res = await fetch("/api/registerSingleEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const registrationIds: string[] = Array.isArray(data?.registrations)
          ? data.registrations.map((r: any) => r.registrationId).filter(Boolean)
          : [];

        setSavedRegIds(registrationIds);
        setIsReadyToPay(true); 
      } else if (res.status === 409) {
        alert("ℹ️ You are already registered for this event");
      } else {
        alert(data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };



const getFieldStyle = (value: string | undefined) => {
    return attemptedSubmit && !value?.trim() 
      ? { borderColor: "#c62828", backgroundColor: "#fff5f5" } 
      : {};
  };

  const getSelectStyle = (value: string | undefined) => {
    return attemptedSubmit && !value 
      ? { borderColor: "#c62828", backgroundColor: "#fff5f5" } 
      : {};
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <img
          src="/wickdwear-logo.png"
          alt="WickdWear"
          className="register-logo"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Memorial Day Draft Registration</h1>
        <p className="form-subtitle">
          Register below to secure your spot in the Memorial Day Draft Event
        </p>

    <div className="form-section">
  <h2>Primary Player</h2>
  {attemptedSubmit && !isPrimaryComplete && (
    <div style={{ color: "#c62828", fontSize: 13, marginBottom: 8 }}>
      All fields marked with * are required.
    </div>
  )}

  <input 
    name="firstName" 
    placeholder="First Name *" 
    value={primary.firstName} 
    onChange={handlePrimaryChange} 
    style={getFieldStyle(primary.firstName)}
  />
  <input 
    name="lastName" 
    placeholder="Last Name *" 
    value={primary.lastName} 
    onChange={handlePrimaryChange} 
    style={getFieldStyle(primary.lastName)}
  />
  <input 
    type="email" 
    name="email" 
    placeholder="Email *" 
    value={primary.email} 
    onChange={handlePrimaryChange} 
    style={getFieldStyle(primary.email)}
  />
  <input 
    type="tel" 
    name="phone" 
    placeholder="Phone Number *" 
    value={primary.phone} 
    onChange={handlePrimaryChange} 
    style={getFieldStyle(primary.phone)}
  />

  <div className="radio-row" style={getSelectStyle(primary.sex)}>
    <label><input type="radio" name="primarySex" value="M" checked={primary.sex === "M"} onChange={handlePrimaryChange} /> Male</label>
    <label><input type="radio" name="primarySex" value="F" checked={primary.sex === "F"} onChange={handlePrimaryChange} /> Female</label>
    <span style={{ fontSize: '12px', marginLeft: '5px' }}>*</span>
  </div>

  <h3>Address</h3>
  <input 
    name="address.street" 
    placeholder="Street Address *" 
    value={primary.address.street} 
    onChange={handlePrimaryChange} 
    style={getFieldStyle(primary.address.street)}
  />
  <div className="form-row">
    <input 
      name="address.city" 
      placeholder="City *" 
      value={primary.address.city} 
      onChange={handlePrimaryChange} 
      style={getFieldStyle(primary.address.city)}
    />
    <select 
      name="address.state" 
      value={primary.address.state} 
      onChange={handlePrimaryChange}
      style={getSelectStyle(primary.address.state)}
    >
      <option value="">State *</option>
      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <input 
      name="address.zip" 
      placeholder="Zip Code *" 
      value={primary.address.zip} 
      onChange={handlePrimaryChange} 
      style={getFieldStyle(primary.address.zip)}
    />
  </div>

  {primaryZipError && <div style={{ color: "#c62828", fontSize: 12, marginTop: 6 }}>{primaryZipError}</div>}

  <select 
    name="skillLevel" 
    value={primary.skillLevel} 
    onChange={handlePrimaryChange}
    style={getSelectStyle(primary.skillLevel)}
  >
    <option value="">Skill Level *</option>
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>

  <div className="form-row two">
    <select 
      name="jerseySize" 
      value={primary.jerseySize} 
      onChange={handlePrimaryChange}
      style={getSelectStyle(primary.jerseySize)}
    >
      <option value="">Jersey Size *</option>
      {getVisibleApparelSizes(primary.sex).map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <select 
      name="shortSize" 
      value={primary.shortSize} 
      onChange={handlePrimaryChange}
      style={getSelectStyle(primary.shortSize)}
    >
      <option value="">Short Size *</option>
      {MEN_APPAREL_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  </div>

  <input 
    name="jerseyNumber" 
    placeholder="Jersey Number *" 
    value={primary.jerseyNumber} 
    onChange={handlePrimaryChange} 
    style={getFieldStyle(primary.jerseyNumber)}
  />
  <input 
    name="jerseyName" 
    placeholder="Jersey Name *" 
    value={primary.jerseyName} 
    onChange={handlePrimaryChange} 
  />

  <select 
    name="preferredPosition" 
    value={primary.preferredPosition} 
    onChange={handlePrimaryChange}
    style={getSelectStyle(primary.preferredPosition)}
  >
    <option value="">Preferred Position *</option>
    {ALL_POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
  </select>

  <select 
    name="secondaryPosition" 
    value={primary.secondaryPosition} 
    onChange={handlePrimaryChange} 
    disabled={!primary.preferredPosition}
    style={getSelectStyle(primary.secondaryPosition)}
  >
    <option value="">Secondary Position *</option>
    {primary.preferredPosition && getSecondaryPositions(primary.preferredPosition).map((p) => <option key={p} value={p}>{p}</option>)}
  </select>

  {/* Rep Code remains optional - no style or asterisk applied */}
  <input 
    name="repCode" 
    placeholder="Rep Code (optional)" 
    value={primary.repCode} 
    onChange={handlePrimaryChange} 
  />
</div>

        <label className="checkbox-row">
          <input type="checkbox" checked={registeringWithCompanion} onChange={(e) => setRegisteringWithCompanion(e.target.checked)} />
          Registering with a companion player (you will be drafted onto the same team)
        </label>

{registeringWithCompanion && (
  <div className="form-section">
    <h2>Companion Player</h2>
    {attemptedSubmit && !isCompanionComplete && (
      <div style={{ color: "#c62828", fontSize: 13, marginBottom: 8 }}>
        All fields marked with * are required.
      </div>
    )}
    
    <input 
      name="firstName" 
      placeholder="First Name *" 
      value={companion.firstName} 
      onChange={handleCompanionChange} 
      style={getFieldStyle(companion.firstName)}
    />
    <input 
      name="lastName" 
      placeholder="Last Name *" 
      value={companion.lastName} 
      onChange={handleCompanionChange} 
      style={getFieldStyle(companion.lastName)}
    />
    <input 
      type="email" 
      name="email" 
      placeholder="Email *" 
      value={companion.email} 
      onChange={handleCompanionChange} 
      style={getFieldStyle(companion.email)}
    />
    <input 
      type="tel" 
      name="phone" 
      placeholder="Phone Number *" 
      value={companion.phone} 
      onChange={handleCompanionChange} 
      style={getFieldStyle(companion.phone)}
    />

    <div className="radio-row" style={getSelectStyle(companion.sex)}>
      <label>
        <input type="radio" name="companionSex" value="M" checked={companion.sex === "M"} onChange={handleCompanionChange} /> Male
      </label>
      <label>
        <input type="radio" name="companionSex" value="F" checked={companion.sex === "F"} onChange={handleCompanionChange} /> Female
      </label>
      <span style={{ fontSize: '12px', marginLeft: '5px' }}>*</span>
    </div>

    <label className="checkbox-row">
      <input type="checkbox" checked={useSameAddress} onChange={(e) => setUseSameAddress(e.target.checked)} />
      Use same address as primary player
    </label>

    {!useSameAddress && (
      <>
        <h3>Address</h3>
        <input 
          name="address.street" 
          placeholder="Street Address *" 
          value={companion.address.street} 
          onChange={handleCompanionChange} 
          style={getFieldStyle(companion.address.street)}
        />
        <div className="form-row">
          <input 
            name="address.city" 
            placeholder="City *" 
            value={companion.address.city} 
            onChange={handleCompanionChange} 
            style={getFieldStyle(companion.address.city)}
          />
          <select 
            name="address.state" 
            value={companion.address.state} 
            onChange={handleCompanionChange}
            style={getSelectStyle(companion.address.state)}
          >
            <option value="">State *</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input 
            name="address.zip" 
            placeholder="Zip Code *" 
            value={companion.address.zip} 
            onChange={handleCompanionChange} 
            style={getFieldStyle(companion.address.zip)}
          />
        </div>
        {companionZipError && <div style={{ color: "#c62828", fontSize: 12, marginTop: 6 }}>{companionZipError}</div>}
      </>
    )}

    <select 
      name="skillLevel" 
      value={companion.skillLevel} 
      onChange={handleCompanionChange}
      style={getSelectStyle(companion.skillLevel)}
    >
      <option value="">Skill Level *</option>
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
    </select>

    <div className="form-row two">
      <select 
        name="jerseySize" 
        value={companion.jerseySize} 
        onChange={handleCompanionChange}
        style={getSelectStyle(companion.jerseySize)}
      >
        <option value="">Jersey Size *</option>
        {getVisibleApparelSizes(companion.sex).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select 
        name="shortSize" 
        value={companion.shortSize} 
        onChange={handleCompanionChange}
        style={getSelectStyle(companion.shortSize)}
      >
        <option value="">Short Size *</option>
        {MEN_APPAREL_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    <input 
      name="jerseyNumber" 
      placeholder="Jersey Number *" 
      value={companion.jerseyNumber} 
      onChange={handleCompanionChange} 
      style={getFieldStyle(companion.jerseyNumber)}
    />
    <input 
      name="jerseyName" 
      placeholder="Jersey Name *" 
      value={companion.jerseyName} 
      onChange={handleCompanionChange} 
    />

    <select 
      name="preferredPosition" 
      value={companion.preferredPosition} 
      onChange={handleCompanionChange}
      style={getSelectStyle(companion.preferredPosition)}
    >
      <option value="">Preferred Position *</option>
      {ALL_POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
    </select>

    <select 
      name="secondaryPosition" 
      value={companion.secondaryPosition} 
      onChange={handleCompanionChange} 
      disabled={!companion.preferredPosition}
      style={getSelectStyle(companion.secondaryPosition)}
    >
      <option value="">Secondary Position *</option>
      {companion.preferredPosition && getSecondaryPositions(companion.preferredPosition).map((p) => <option key={p} value={p}>{p}</option>)}
    </select>
  </div>
)}

        {attemptedSubmit && !canSubmit && (
          <div style={{ marginBottom: 12, color: "#c62828", fontSize: 14, fontWeight: 500 }}>
            Please complete all required fields before registering.
          </div>
        )}

        <div className="registration-actions" style={{ marginTop: 24 }}>
          {!isReadyToPay ? (
            <>
<button
  type="submit"
  className="submit-btn"
  disabled={!canSubmit || submitting}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 16px",
    fontSize: 16,
    fontWeight: 600,
    width: "100%",
    // Optional: add visual feedback for the disabled state
    opacity: canSubmit ? 1 : 0.7 
  }}
>
  {submitting 
    ? "Processing..." 
    : canSubmit 
      ? "Register & Pay" 
      : "Complete Form to Register and Pay"}
</button>

              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#666" }}>
                <span>Secure checkout with</span>
                <img src={paypalLogo} alt="PayPal" style={{ height: 14, display: "block" }} />
              </div>
            </>
          ) : (
/* ... around line 430 in your file ... */
<div className="paypal-container">
  <h3 style={{ textAlign: "center", marginBottom: 16, color: "#fff" }}>Complete Your Payment</h3>
  <PayPalButtons
    style={{ layout: "vertical", shape: "pill" }}
    createOrder={async () => {
      // 1. Create the order with PayPal
      const res = await fetch("/api/paypalCreateOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hasCompanion: registeringWithCompanion }),
      });
      const order = await res.json();

      // 2. WAIT for the database to link the Order ID to your Registrations
      // This is the critical "Fix" — we MUST await this before returning the ID
      const attachRes = await fetch("/api/attachPayPalOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: order.orderId, 
          registrationIds: savedRegIds 
        }),
      });

      if (!attachRes.ok) {
        throw new Error("Failed to link payment to registration. Please try again.");
      }

      // 3. Now it is safe to return the ID to PayPal
      return order.orderId;
    }}
onApprove={async (data, actions) => {
  try {
    // 1. Capture the order on the backend
    const response = await fetch("/api/paypalCaptureOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID }),
    });

    const result = await response.json();

    if (response.ok && result.ok) {
      // 2. FORCE the redirect with a clean URL parameter
      // Note: check if your PaymentSuccess page expects 'orderId' or 'orderID'
      window.location.href = `/payment-success?orderId=${data.orderID}`;
    } else {
      console.error("Capture failed:", result);
      // Fallback if the backend captured but returned an error
      window.location.href = `/payment-success?error=capture_failed`;
    }
  } catch (err) {
    console.error("Redirection error:", err);
  }
}}
  />
</div>
          )}
        </div>
      </form>
    </div>
  );
}
