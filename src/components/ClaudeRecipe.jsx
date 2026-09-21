import ReactMarkdown from "react-markdown";

export default function Recipe({ recipe, onReset }) {
  return (
    <section className="suggested-recipe-container">
      <ReactMarkdown>{recipe}</ReactMarkdown>
      {onReset && (
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button
            onClick={onReset}
            style={{
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(180deg, #2a2a28 0%, #141413 100%)",
              color: "#FAFAF8",
              padding: "12px 24px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: "pointer",
              boxShadow: "0 6px 0 #000, 0 14px 24px -10px rgba(0,0,0,0.6)",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(4px)";
              e.currentTarget.style.boxShadow =
                "0 2px 0 #000, 0 6px 12px -8px rgba(0,0,0,0.6)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 0 #000, 0 14px 24px -10px rgba(0,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 0 #000, 0 14px 24px -10px rgba(0,0,0,0.6)";
            }}
          >
            🔄 Start over
          </button>
        </div>
      )}
    </section>
  );
}