import type { CSSProperties } from "react";
import downArrowSrc from "../svg/down-arrow.svg";

export default function Hero() {
  return (
    <div id="hero" style={heroContainer}>
      <div style={content}>
        {/* Add your HTML content here */}
        <h1 style={heading}>Emily Apel</h1>
        <p style={paragraph}>Immersive Experience Designer & Creative technologist</p>
      </div>
      <div style={downArrowWrap} aria-hidden="true">
        <img src={downArrowSrc} alt="" style={downArrowIcon} />
      </div>
    </div>
  );
}

const heroContainer: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  zIndex: 1,
};

const content: CSSProperties = {
  pointerEvents: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  maxWidth: "600px",
  padding: "40px 20px",
};

const heading: CSSProperties = {
  fontSize: "50px",
  fontWeight: 700,
  marginBottom: "8px",
  margin: 0,
  fontFamily: "Against, sans-serif",
  letterSpacing: "0.2em",
};

const paragraph: CSSProperties = {
  fontSize: "16px",
  opacity: 0.9,
  lineHeight: 1.6,
  margin: 0,
};

const downArrowWrap: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: "32px",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  opacity: 0.8,
  pointerEvents: "none",
};

const downArrowIcon: CSSProperties = {
  width: "85px",
  height: "180px",
  display: "block",
  transform: "translateY(15px)",
};
