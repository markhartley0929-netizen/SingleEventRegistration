import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type CaptureState = "idle" | "processing" | "success" | "error";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("token");

  const [state, setState] = useState<CaptureState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guard against double execution (React strict mode, refresh, etc.)
  const hasCapturedRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setState("error");
      setErrorMessage("Missing PayPal order reference.");
      return;
    }

    if (hasCapturedRef.current) return;
    hasCapturedRef.current = true;

    const capture = async () => {
      setState("processing");

      try {
        const res = await fetch("/api/paypalCaptureOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // backend might return empty body
        }

        if (!res.ok) {
          throw new Error(data?.message || "Payment capture failed.");
        }

        setState("success");
      } catch (err: any) {
        setState("error");
        setErrorMessage(
          err?.message ||
            "We could not complete your payment. Please contact support."
        );
      }
    };

    capture();
  }, [orderId]);

  // -----------------------------
  // Render states
  // -----------------------------
  if (state === "processing" || state === "idle") {
    return (
      <div className="payment-status-page">
        <h1>Finalizing Registration…</h1>
        <p>Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="payment-status-page">
        <h1>✅ Registration Complete</h1>
        <p>You are officially registered for the event.</p>
        <p>You may now close this window.</p>
      </div>
    );
  }

  // Error state
  return (
    <div className="payment-status-page">
      <h1>❌ Payment Issue</h1>
      <p>{errorMessage}</p>

      <button
        onClick={() => {
          hasCapturedRef.current = false;
          setState("idle");
          setErrorMessage(null);
        }}
      >
        Retry Payment Confirmation
      </button>
    </div>
  );
}
