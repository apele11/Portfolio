import { useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import CoverMedia from "./CoverMedia";
import { coverScrimGradient } from "../data/coverScrim";
import { useIsMobile, VIEWPORT_UNIT } from "../viewport";
import { useScrollAnimation } from "../hooks/useScrollAnimation";


export interface ProjectCardProps {
  id: string;
  eyebrow: string;
  header: string;
  subtitle: string;
  coverUrl: string;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  scrimStrength?: number;
  scrimWidth?: number;
  order?: number;
}

export default function ProjectCard({
  id,
  eyebrow,
  header,
  subtitle,
  coverUrl,
  scrimStrength,
  scrimWidth,
}: ProjectCardProps) {
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useScrollAnimation(rootRef, imageRef, textContentRef, {
    imageTravel: isMobile ? 90 : 140,
    textTravel: isMobile ? 60 : 90,
    textLag: isMobile ? 30 : 60,
    smoothing: 1.1,
    layoutKey: isMobile ? "mobile" : "desktop",
  });

  const scrim = coverScrimFor({ scrimStrength, scrimWidth });

  return (
    <Link
      ref={rootRef}
      to={`/projects/${id}`}
      aria-label={header}
      style={isMobile ? { ...projectLink, ...mobileProjectSection } : projectLink}
    >
      {isMobile ? (
        <>
          <div ref={imageRef}>
            <CoverMedia
              src={coverUrl}
              alt={header}
              style={{ ...projectImage, ...mobileProjectImage }}
            />
          </div>
          <div ref={textContentRef} style={mobileTextContent}>
            <p style={{ ...eyebrowStyle, ...mobileEyebrow }}>
              {eyebrow}
            </p>
            <h2 style={{ ...titleStyle, ...mobileTitle }}>
              {header}
            </h2>
            <p style={{ ...subtitleStyle, ...mobileSubtitle }}>
              {subtitle}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* The scrim lives inside the animated wrapper, not beside it: as a
              sibling it kept its layout position while GSAP translated the
              image, so the two came apart mid-scroll. The wrapper is inset-0
              because transforming it makes it the containing block for these
              absolutely positioned children. */}
          <div ref={imageRef} style={imageLayer}>
            <CoverMedia
              src={coverUrl}
              alt={header}
              style={projectImage}
            />
            {scrim && <div style={scrim} aria-hidden="true" />}
          </div>
          <div ref={textContentRef} style={textContent}>
            <p style={eyebrowStyle}>{eyebrow}</p>
            <h2 style={titleStyle}>{header}</h2>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>
        </>
      )}
    </Link>
  );
}

// Styles
const imageLayer: CSSProperties = {
  position: "absolute",
  inset: 0,
};

const projectLink: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "block",
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
};

const mobileProjectSection: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "0 var(--layout-gutter)",
  boxSizing: "border-box",
};

// The cover is width-driven (100% wide at 16/9), so on its own it has no idea
// how much vertical room the panel actually has. On a short viewport — a phone
// held sideways, a small devtools preset — the image plus the text block came
// to more than the panel's height and the section's `overflow: hidden` sheared
// the subtitle off the bottom. Capping against viewport height as well leaves
// the image free to crop instead. The cap is inert at ordinary phone
// proportions, where the width-driven height lands well under it.
const mobileProjectImage: CSSProperties = {
  position: "static",
  top: "auto",
  left: "auto",
  transform: "none",
  width: "100%",
  maxWidth: "560px",
  maxHeight: `36${VIEWPORT_UNIT}`,
  objectFit: "cover",
};

const mobileTextContent: CSSProperties = {
  width: "100%",
  maxWidth: "560px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  // Without an explicit min-height a flex item refuses to shrink below its
  // content, which is what pushes the block past the panel edge when the
  // viewport is short.
  minHeight: 0,
};

const mobileEyebrow: CSSProperties = {
  fontSize: "13px",
  letterSpacing: "0.18em",
};

const mobileTitle: CSSProperties = {
  fontSize: "clamp(26px, 7.5vw, 38px)",
};

const mobileSubtitle: CSSProperties = {
  fontSize: "15px",
};

const projectImage: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  aspectRatio: "16 / 9",
  objectFit: "cover",
  zIndex: 1,
};

function coverScrimFor(props: { scrimStrength?: number; scrimWidth?: number }): CSSProperties | null {
  const background = coverScrimGradient(props.scrimStrength, props.scrimWidth);
  if (!background) return null;
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    aspectRatio: "16 / 9",
    zIndex: 1,
    background,
    pointerEvents: "none",
  };
}

const textContent: CSSProperties = {
  position: "absolute",
  zIndex: 2,
  width: "clamp(10%, 30%, 600px)",
  top: "calc(50% - (50vw * 9 / 32))",
  left: "calc(15%)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "white",
  margin: 0,
  textShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.8), 0px 4px 16px rgba(0, 0, 0, 0.6)",
};

const titleStyle: CSSProperties = {
  fontSize: "42px",
  fontWeight: 700,
  margin: 0,
  color: "white",
  fontFamily: "DM Sans, sans-serif",
  letterSpacing: "0.05em",
  lineHeight: 1.1,
  textTransform: "uppercase",
  textShadow:
    "0px 2px 8px rgba(0, 0, 0, 0.8), 0px 6px 24px rgba(0, 0, 0, 0.6)",
};

const subtitleStyle: CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.6,
  color: "rgba(255, 255, 255, 0.95)",
  margin: 0,
  fontFamily: '"Space Grotesk", sans-serif',
  textShadow:
    "0px 2px 4px rgba(0, 0, 0, 0.8), 0px 4px 16px rgba(0, 0, 0, 0.6)",
};
