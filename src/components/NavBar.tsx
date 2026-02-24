import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

function NavLink({ children, onClick }: { children: string; onClick?: () => void }) {
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
      onClick={onClick}
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

export default function NavBar({ onAdminClick }: { onAdminClick?: () => void }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleBrandClick = () => {
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav style={nav}>
      <div style={navInner}>
        <span style={{ ...brand, cursor: "pointer" }} onClick={handleBrandClick}>
          EMILY
        </span>
        {isMobile ? (
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            style={menuButton}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span style={menuLine} />
            <span style={menuLine} />
            <span style={menuLine} />
          </button>
        ) : (
          <div style={rightGroup}>
            <NavLink>WORKS</NavLink>
            <NavLink>PLAYGROUND</NavLink>
            <NavLink>ABOUT</NavLink>
            {import.meta.env.DEV && (
              <NavLink onClick={onAdminClick}>ADMIN</NavLink>
            )}
          </div>
        )}
      </div>

      {isMobile && (
        <div style={{ ...mobileMenu, ...(isMenuOpen ? mobileMenuOpen : mobileMenuClosed) }}>
          <NavLink onClick={() => setIsMenuOpen(false)}>WORKS</NavLink>
          <NavLink onClick={() => setIsMenuOpen(false)}>PLAYGROUND</NavLink>
          <NavLink onClick={() => setIsMenuOpen(false)}>ABOUT</NavLink>
          {import.meta.env.DEV && (
            <NavLink
              onClick={() => {
                onAdminClick?.();
                setIsMenuOpen(false);
              }}
            >
              ADMIN
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

const nav: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
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

const menuButton: CSSProperties = {
  width: "42px",
  height: "42px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
};

const menuLine: CSSProperties = {
  width: "18px",
  height: "1.5px",
  backgroundColor: "white",
  display: "block",
};

const mobileMenu: CSSProperties = {
  position: "absolute",
  top: "100%",
  left: "0",
  right: "0",
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem 1.25rem",
  borderRadius: 0,
  border: "1px solid rgba(255,255,255,0.18)",
  backgroundColor: "rgba(22, 22, 28, 0.42)",
  backdropFilter: "blur(14px) saturate(140%)",
  WebkitBackdropFilter: "blur(14px) saturate(140%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.28)",
  transform: "translateY(-8px)",
  opacity: 0,
  transition: "opacity 0.25s ease, transform 0.25s ease",
};

const mobileMenuOpen: CSSProperties = {
  pointerEvents: "auto",
  opacity: 1,
  transform: "translateY(0)",
};

const mobileMenuClosed: CSSProperties = {
  pointerEvents: "none",
  opacity: 0,
  transform: "translateY(-8px)",
};

const link: CSSProperties = {
  fontWeight: 400,
  cursor: "pointer",
};
