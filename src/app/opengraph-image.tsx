import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Affiliate AI — AI Affiliate Content Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff" }}>
            Affiliate AI
          </span>
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          Generate viral affiliate content in seconds
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          TikTok scripts · Product reviews · Sales captions
        </p>
      </div>
    ),
    { ...size }
  );
}
