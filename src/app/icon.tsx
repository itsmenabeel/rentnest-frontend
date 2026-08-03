import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

// Matches the navbar mark (rounded terracotta square, house glyph) so the
// browser tab icon and the in-app logo read as the same brand mark.
// Color is --primary from globals.css, hardcoded here since ImageResponse
// (Satori) doesn't resolve CSS custom properties or oklch().
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ae4024",
          borderRadius: 7,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottom: "8px solid white",
            }}
          />
          <div style={{ width: 13, height: 9, background: "white" }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
