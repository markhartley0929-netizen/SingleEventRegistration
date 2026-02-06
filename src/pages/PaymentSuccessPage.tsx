import { useEffect, useRef, useState } from "react";
import {
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import "./PaymentSuccessPage.css";

type CaptureState = "idle" | "processing" | "success" | "error";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
const orderId = searchParams.get("orderId") || searchParams.get("token");

  const [state, setState] = useState<CaptureState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guard against double execution
  const hasCapturedRef = useRef(false);

useEffect(() => {
  // 1. Venmo uses 'token', Standard uses 'orderId'
  const activeId = searchParams.get("orderId") || searchParams.get("token");

  if (!activeId) {
    setState("error");
    setErrorMessage("Missing PayPal order reference.");
    return;
  }

  if (hasCapturedRef.current) return;
  hasCapturedRef.current = true;

  const capture = async () => {
    setState("processing");
    console.log("Attempting capture for ID:", activeId);

    try {
      const res = await fetch("/api/paypalCaptureOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: activeId }),
      });

      const data = await res.json();
      console.log("PayPal Response Data:", data);

      // 2. Check for success OR the specific "Already Captured" error
      // PayPal usually returns a 422 Unprocessable Entity for already captured orders
      const isSuccess = res.ok || data?.status === "COMPLETED";
      
      const isAlreadyCaptured = 
        data?.name === "UNPROCESSABLE_ENTITY" && 
        data?.details?.some((d: any) => d.issue === "ORDER_ALREADY_COMPLETED");

      if (isSuccess || isAlreadyCaptured) {
        console.log("Success! Payment is confirmed.");
        setState("success");
      } else {
        // If it's a real error, show the specific message from PayPal
        throw new Error(data?.message || "Payment capture failed.");
      }
    } catch (err: any) {
      console.error("Capture Error:", err);
      setState("error");
      setErrorMessage(err?.message || "Confirmation failed. Please check your dashboard.");
    }
  };

  capture();
}, [searchParams]); // Trigger on any URL change

  /* =========================
     Shared layout wrapper
  ========================= */

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="payment-page">
      <img
        src="/wickdwear-logo.png"
        alt="WickdWear"
        className="payment-logo"
        onClick={() => navigate("/")}
      />
      <div className="payment-status-page">{children}</div>
    </div>
  );

  /* =========================
     Render states
  ========================= */

  if (state === "processing" || state === "idle") {
    return (
      <PageWrapper>
        <h1>Finalizing Registration…</h1>
        <p>Please wait while we confirm your payment.</p>
      </PageWrapper>
    );
  }

  if (state === "success") {
    return (
      <PageWrapper>
        <h1>✅ Registration Complete</h1>
        <p>You are officially registered for the event.</p>

        <div className="payment-actions">
          <Link to="/registrations" className="primary-link">
            View Registered Players
          </Link>

          <button
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1>❌ Payment Issue</h1>
      <p>{errorMessage}</p>

      <button
        className="secondary-button"
        onClick={() => {
          hasCapturedRef.current = false;
          setState("idle");
          setErrorMessage(null);
        }}
      >
        Retry Payment Confirmation
      </button>
    </PageWrapper>
  );
}
