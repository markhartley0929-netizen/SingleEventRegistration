export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px",
        background: "#f5f7fa",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "#fff",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>
          🥎 Single Event Registration
        </h1>

        <p style={{ color: "#555", marginBottom: 24 }}>
          Register players for a single tournament event.  
          Fast. Simple. No fluff.
        </p>

        <hr style={{ marginBottom: 24 }} />

        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Register Player
          </button>

          <button
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View Registrations
          </button>
        </div>

        <p style={{ marginTop: 32, fontSize: 13, color: "#888" }}>
          ✅ App loaded successfully
        </p>
      </div>
    </div>
  );
}
