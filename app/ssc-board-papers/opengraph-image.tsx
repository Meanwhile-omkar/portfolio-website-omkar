import { ImageResponse } from "next/og";

// Link preview for WhatsApp / Telegram / Google: how the page looks when students share it.
export const alt = "Maharashtra SSC board question papers 2019–2026, free PDFs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const chips = ["Algebra", "Geometry", "Science 1 & 2", "History", "Geography", "Marathi", "Hindi", "English"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: "#ffffff",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(29,29,31,0.16) 1.4px, transparent 1.6px)",
          backgroundSize: "26px 26px",
          fontFamily: "sans-serif",
          color: "#1d1d1f",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 3, color: "#8a8a8e" }}>MAHARASHTRA STATE BOARD · CLASS 10</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontSize: 92, fontWeight: 800, lineHeight: 1.02 }}>
          <span>SSC board papers</span>
          <span style={{ background: "#ffc700", padding: "0 14px", alignSelf: "flex-start", marginTop: 8 }}>2019 – 2026, free</span>
        </div>
        <div style={{ marginTop: 30, fontSize: 32, color: "#424242" }}>Real PYQs · English & Marathi medium · prelims · question banks</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: "auto" }}>
          {chips.map((c) => (
            <span key={c} style={{ border: "3px solid #1d1d1f", borderRadius: 999, padding: "8px 20px", fontSize: 26, background: "#fff" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
