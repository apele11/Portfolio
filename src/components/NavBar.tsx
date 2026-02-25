import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";


function NavLink({
  children,
  to,
  onClick,
}: {
  children: string;
  to?: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isActive = to ? location.pathname === to : false;
  const underlineWidth = isHovered || isActive ? "100%" : "0%";

  const sharedStyles: CSSProperties = {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    textDecoration: "none",
    color: "inherit",
    pointerEvents: "auto",
  };

  const underlineStyles: CSSProperties = {
    position: "absolute",
    bottom: "-4px",
    left: 0,
    height: "1px",
    backgroundColor: "white",
    width: underlineWidth,
    transition: "width 0.3s ease",
  };

  // Button-like link (no route), for custom actions
  if (!to) {
    return (
      <div
        style={sharedStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.();
        }}
      >
        <span style={link}>{children}</span>
        <div style={underlineStyles} />
      </div>
    );
  }
  // Normal route navigation
  return (
    <Link
      to={to}
      style={sharedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span style={link}>{children}</span>
      <div style={underlineStyles} />
    </Link>
  );
}

export default function NavBar({ onAdminClick }: { onAdminClick?: () => void }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const goHome = () => {
  setIsMenuOpen(false);

  if (location.pathname !== "/") {
    navigate("/");

    // wait for route change, then scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav style={nav}>
      <div style={navInner}>
        {/* EMILY → "/" (or scroll to hero if already on "/") */}
        <NavLink onClick={goHome}>EMILY</NavLink>

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
            {/* WORKS → "/" (or scroll to hero if already on "/") */}
            <NavLink onClick={goHome}>WORKS</NavLink>

            <NavLink to="/playground">PLAYGROUND</NavLink>
            <NavLink to="/about">ABOUT</NavLink>

            {import.meta.env.DEV && (
              <NavLink
                onClick={() => {
                  onAdminClick?.();
                }}
              >
                ADMIN
              </NavLink>
            )}
          </div>
        )}
      </div>

      {isMobile && (
        <div style={{ ...mobileMenu, ...(isMenuOpen ? mobileMenuOpen : mobileMenuClosed) }}>
          <NavLink
            onClick={() => {
              goHome();
            }}
          >
            WORKS
          </NavLink>

          <NavLink to="/playground" onClick={closeMenu}>
            PLAYGROUND
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            ABOUT
          </NavLink>

          {import.meta.env.DEV && (
            <NavLink
              onClick={() => {
                onAdminClick?.();
                closeMenu();
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
  fontSize: "1rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "white",
  opacity: 0.8,
  gap: "0.5rem",
  pointerEvents: "auto",
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
  gap: "4px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  pointerEvents: "auto",
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