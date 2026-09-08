import { useState, useEffect, useRef, type RefObject } from "react";
import type { CSSProperties } from "react";
import type * as THREE from "three";
import { VIEWPORT_HEIGHT } from "../viewport";
import ProjectCard from "./ProjectCard";

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
  scrimStrength?: number;
  scrimWidth?: number;
  order?: number;
}

interface ProjectsFrontendProps {
  projects: Project[];
  loading: boolean;
  uniformsRef?: RefObject<ShaderUniforms | null>;
}

export default function ProjectsFrontend({
  projects,
  loading,
  uniformsRef,
}: ProjectsFrontendProps) {
  const [visibleProjectId, setVisibleProjectId] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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
            if (el) {
              sectionRefs.current[project.id] = el;
            }
          }}
          style={fullScreenProjectSection}
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

          <ProjectCard {...project} />
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

const fullScreenProjectSection: CSSProperties = {
  position: "relative",
  width: "100%",
  height: VIEWPORT_HEIGHT,
  overflow: "hidden",
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
