import { useState } from "react";
import type { CSSProperties } from "react";

function NavLink({ children }: { children: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={link}>{children}</span>
      <div
        style={{
          position: "absolute",
          bottom: "-4px",
          left: 0,
          height: "1px",
          backgroundColor: "white",
          width: isHovered ? "100%" : "0%",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

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
          <NavLink>WORKS</NavLink>
          <NavLink>PLAYGROUND</NavLink>
          <NavLink>ABOUT</NavLink>
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
  padding: "3.5rem",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
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
  gap: "0.5rem",
  pointerEvents: "auto",
};

const brand: CSSProperties = {
  fontWeight:400,
};

const rightGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4rem",
};

const link: CSSProperties = {
  fontWeight: 400,
  cursor: "pointer",
};
