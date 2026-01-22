import type { CSSProperties } from "react";

export default function NavBar() {
  const handleBrandClick = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={nav}>
      <div style={navInner}>
        <span style={{ ...brand, cursor: "pointer" }} onClick={handleBrandClick}>
          EMILY
        </span>
        <div style={rightGroup}>
          <span style={link}>WORKS</span>
          <span style={link}>PLAYGROUND</span>
          <span style={link}>ABOUT</span>
        </div>
      </div>
    </nav>
  );
}

const nav: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  padding: "4rem",
  marginLeft: "2rem",
  marginRight: "2rem",
  pointerEvents: "none",
};

const navInner: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: "14px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "white",
  pointerEvents: "auto",
};

const brand: CSSProperties = {
  fontWeight: 600,
};

const rightGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4rem",
};

const link: CSSProperties = {
  fontWeight: 500,
  cursor: "pointer",
};
