import { useState, useEffect, useRef, type RefObject } from "react";
import type { CSSProperties } from "react";
import type * as THREE from "three";
import CoverMedia from "./CoverMedia";
import { useIsMobile, VIEWPORT_HEIGHT } from "../viewport";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

export interface Project {
  id: string;
  eyebrow: string;
  header: string;
  subtitle: string;
  coverUrl: string;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  order?: number;
}

interface ProjectsFrontendProps {
  projects: Project[];
  loading: boolean;
  uniformsRef?: RefObject<ShaderUniforms | null>;
  onProjectSelect?: (projectId: string) => void;
}

export default function ProjectsFrontend({
  projects,
  loading,
  uniformsRef,
  onProjectSelect,
}: ProjectsFrontendProps) {
  const [visibleProjectId, setVisibleProjectId] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const isMobile = useIsMobile();

  // Use scroll event listener with requestAnimationFrame to detect the active section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // If the scroll position is in the upper half of the Hero section,
          // treat the Hero section as the active view
          if (window.scrollY < window.innerHeight * 0.5) {
            setVisibleProjectId("hero");
            ticking = false;
            return;
          }

          const centerY = window.innerHeight / 2;
          let activeId: string | null = null;
          let minDistance = Infinity;

          Object.entries(sectionRefs.current).forEach(([projectId, element]) => {
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - centerY);

            if (distance < minDistance) {
              minDistance = distance;
              activeId = projectId;
            }
          });

          if (activeId) {
            setVisibleProjectId(activeId);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run immediately to detect active project on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Also watch for any dynamic layout shifts using a ResizeObserver
    const resizeObserver = new ResizeObserver(handleScroll);
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) resizeObserver.observe(ref);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      resizeObserver.disconnect();
    };
  }, [projects.length]);

  if (loading) {
    return (
      <section style={projectsSection}>
        <div style={container}>
          <p style={emptyState}>Loading projects...</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section style={projectsSection}>
        <div style={container}>
          <p style={emptyState}>No projects yet.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* If we are in the Hero section (top of the page), restore the Hero's default colors */}
      {uniformsRef && (
        <UpdateColorsScript
          uniformsRef={uniformsRef}
          colors={["#19053d", "#2f7687", "#40aba2", "#6c6597"]}
          isVisible={visibleProjectId === "hero" || visibleProjectId === null}
        />
      )}

      {projects.map((project) => (
        <section
          key={project.id}
          data-project-id={project.id}
          ref={(el) => {
            if (el) sectionRefs.current[project.id] = el;
          }}
          style={{
            ...fullScreenProjectSection,
            ...(isMobile ? mobileProjectSection : null),
            cursor: "pointer",
          }}
          onClick={() => onProjectSelect?.(project.id)}
        >
          {/* Use project colors if defined, otherwise fall back to hero base colors */}
          {uniformsRef && (
            <UpdateColorsScript
              uniformsRef={uniformsRef}
              colors={
                project.color1 && project.color2 && project.color3 && project.color4
                  ? [project.color1, project.color2, project.color3, project.color4]
                  : ["#19053d", "#2f7687", "#40aba2", "#6c6597"]
              }
              isVisible={visibleProjectId === project.id}
            />
          )}

          {/* Cover — a still or a looping clip, depending on the project */}
          {isMobile ? (
            <>
              <CoverMedia
                src={project.coverUrl}
                alt={project.header}
                style={{ ...projectImage, ...mobileProjectImage }}
              />
              {/* Text Content */}
              <div style={mobileTextContent}>
                <p style={{ ...eyebrow, ...mobileEyebrow }}>{project.eyebrow}</p>
                <h2 style={{ ...title, ...mobileTitle }}>{project.header}</h2>
                <p style={{ ...subtitle, ...mobileSubtitle }}>{project.subtitle}</p>
              </div>
            </>
          ) : (
            <>
              <CoverMedia
                src={project.coverUrl}
                alt={project.header}
                style={projectImage}
              />
              {/* Text Content */}
              <div style={textContent}>
                <p style={eyebrow}>{project.eyebrow}</p>
                <h2 style={title}>{project.header}</h2>
                <p style={subtitle}>{project.subtitle}</p>
              </div>
            </>
          )}
        </section>
      ))}
    </>
  );
}

// Component to update shader colors
function UpdateColorsScript({
  uniformsRef,
  colors,
  isVisible,
}: {
  uniformsRef: RefObject<ShaderUniforms | null>;
  colors: [string, string, string, string];
  isVisible: boolean;
}) {
  useEffect(() => {
    if (isVisible && uniformsRef.current) {
      colors.forEach((hexColor, index) => {
        const colorKey = `uColor${index + 1}` as keyof ShaderUniforms;
        if (uniformsRef.current && colorKey in uniformsRef.current) {
          const uniform = uniformsRef.current[colorKey];
          if (uniform && "value" in uniform) {
            uniform.value.setStyle(hexColor);
          }
        }
      });
    }
  }, [colors, uniformsRef, isVisible]);

  return null; // This component doesn't render anything
}

// === Style Definitions ===
// Add your styles here or move them to a separate CSS file

const fullScreenProjectSection: CSSProperties = {
  position: "relative",
  width: "100%",
  height: VIEWPORT_HEIGHT,
  overflow: "hidden",
};

/**
 * The desktop composition puts a 30%-wide text column across the left edge of a
 * half-width cover. Taken literally to a phone that collapses: at 375px the
 * cover lands at 188x106 and the column becomes a 113px ribbon of wrapped words
 * lying on top of it.
 *
 * So the phone drops the straddle rather than scaling it down. The cover goes
 * full-column and the whole text block sits below it, off the image entirely —
 * nothing overlaps, and the type gets the full column width to set in.
 */
const mobileProjectSection: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "0 var(--layout-gutter)",
  boxSizing: "border-box",
};

const mobileProjectImage: CSSProperties = {
  position: "static",
  top: "auto",
  left: "auto",
  transform: "none",
  width: "100%",
  maxWidth: "560px",
};

/** Plain block under the cover — same column width, so the two edges line up. */
const mobileTextContent: CSSProperties = {
  width: "100%",
  maxWidth: "560px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
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

const eyebrow: CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "white",
  margin: 0,
  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8), 0px 4px 16px rgba(0, 0, 0, 0.6)",
};

const title: CSSProperties = {
  fontSize: "42px",
  fontWeight: 700,
  margin: 0,
  color: "white",
  fontFamily: "DM Sans, sans-serif",
  letterSpacing: "0.05em",
  lineHeight: 1.1,
  textTransform: "uppercase",
  textShadow: "0px 2px 8px rgba(0, 0, 0, 0.8), 0px 6px 24px rgba(0, 0, 0, 0.6)",
};

const subtitle: CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.6,
  color: "rgba(255, 255, 255, 0.95)",
  margin: 0,
  fontFamily: '"Space Grotesk", sans-serif',
  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8), 0px 4px 16px rgba(0, 0, 0, 0.6)",
};

const projectsSection: CSSProperties = {
  padding: "80px 0",
  backgroundColor: "#0f0f0f",
};

const container: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 2rem",
};

const emptyState: CSSProperties = {
  textAlign: "center",
  color: "white",
  fontSize: "18px",
};
