import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { prefetchPlayground } from "../playgroundPrefetch";


function NavLink({
  children,
  to,
  onClick,
  onIntent,
}: {
  children: string;
  to?: string;
  onClick?: () => void;
  /** Fired on hover/focus — a click is likely, so start fetching what it needs. */
  onIntent?: () => void;
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
    height: "1.5px",
    backgroundColor: "currentColor",
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
      onMouseEnter={() => {
        setIsHovered(true);
        onIntent?.();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={onIntent}
      onTouchStart={onIntent}
      onClick={onClick}
    >
      <span style={link}>{children}</span>
      <div style={underlineStyles} />
    </Link>
  );
}

export default function NavBar() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isOverLight, setIsOverLight] = useState(false);
  const lastScrollY = useRef(0);
  const innerRef = useRef<HTMLDivElement>(null);

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
      syncInk();
    };

    // Which surface is under the row right now. Pages that lay a light ground
    // under the fixed nav mark it `data-nav-ink="dark"`; anything unmarked is
    // assumed dark, which is the shader hero everywhere else.
    const syncInk = () => {
      const row = innerRef.current;
      if (!row) return;
      const { top, bottom } = row.getBoundingClientRect();
      const mid = (top + bottom) / 2;
      const overLight = Array.from(
        document.querySelectorAll<HTMLElement>('[data-nav-ink="dark"]')
      ).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      setIsOverLight(overLight);
    };

    const onScroll = () => {
      syncInk();
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (isScrollingDown) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    // The new route's ground may differ from the old one's, and it mounts
    // without a scroll event to trigger the check.
    syncInk();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav style={{ ...nav, transform: isVisible ? "translateY(0)" : "translateY(-100%)" }}>
      <div ref={innerRef} style={{ ...navInner, color: isOverLight ? "#0a0a0a" : "#ffffff" }}>
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

            <NavLink to="/playground" onIntent={prefetchPlayground}>
              PLAYGROUND
            </NavLink>
            <NavLink to="/about">ABOUT</NavLink>

            {import.meta.env.DEV && (
              <NavLink to="/admin">
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

          <NavLink to="/playground" onClick={closeMenu} onIntent={prefetchPlayground}>
            PLAYGROUND
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            ABOUT
          </NavLink>

          {import.meta.env.DEV && (
            <NavLink to="/admin" onClick={closeMenu}>
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
  width: "100%",
  zIndex: 1000,
  // Horizontal padding tracks --layout-gutter so the nav row starts and ends
  // on the same edges as the page content column at every width, instead of
  // a fixed 4rem that overhangs the gutter once it tapers below that.
  padding: "3.5rem var(--layout-gutter)",
  pointerEvents: "none",
  boxSizing: "border-box",
  transition: "transform 0.3s ease-in-out",
};

const navInner: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: '"Space Grotesk", sans-serif',
  // Type and tracking shrink with the viewport so the row always fits between
  // the gutters — at the narrow end of desktop the old fixed 0.85rem/0.2em
  // ran the links into the wordmark.
  fontSize: "clamp(0.72rem, 0.95vw, 0.85rem)",
  letterSpacing: "clamp(0.1em, 0.35vw, 0.15em)",
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  gap: "0.5rem",
  pointerEvents: "auto",
  // `color` is set on the element, not here: the nav crosses both the dark
  // shader hero and the case studies' paper-white ground, so the ink flips
  // between the two extremes rather than blending. `difference` used to do
  // this automatically, but inverting against a mid-tone ground (the hero's
  // indigo) just yields another mid-tone — exactly where contrast was worst.
  transition: "color 0.2s ease",
};

const rightGroup: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "clamp(1.1rem, 2.6vw, 2.5rem)",
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
  color: "inherit",
  cursor: "pointer",
  pointerEvents: "auto",
};

const menuLine: CSSProperties = {
  width: "18px",
  height: "1.5px",
  backgroundColor: "currentColor",
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
  // This panel carries its own dark backdrop, so it stays light-on-dark even
  // when the row above it has inked dark for a paper-white page behind it.
  color: "#ffffff",
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
  // Weight is the contrast lever that survives `difference` blending: the row
  // can't paint a scrim or pick a color, so heavier strokes are what keep the
  // labels legible over mid-tone shader frames.
  fontWeight: 500,
  cursor: "pointer",
};