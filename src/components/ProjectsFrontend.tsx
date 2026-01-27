import { useState, useEffect, useRef, type MutableRefObject } from "react";
import type { CSSProperties } from "react";
import ColorExtractor from "./ColorExtractor";
import * as THREE from "three";

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
}

interface ProjectsFrontendProps {
  projects: Project[];
  loading: boolean;
  uniformsRef?: MutableRefObject<ShaderUniforms | null>;
}

export default function ProjectsFrontend({
  projects,
  loading,
  uniformsRef,
}: ProjectsFrontendProps) {
  const [visibleProjectId, setVisibleProjectId] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Use Intersection Observer to detect when sections are in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = entry.target.getAttribute("data-project-id");
            console.log("Project visible:", projectId);
            if (projectId) {
              setVisibleProjectId(projectId);
            }
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
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
      {projects.map((project) => (
        <section
          key={project.id}
          data-project-id={project.id}
          ref={(el) => {
            if (el) sectionRefs.current[project.id] = el;
          }}
          style={fullScreenProjectSection}
        >
          {/* Use project colors if defined, otherwise extract from image */}
          {uniformsRef && visibleProjectId === project.id && (
            <>
              {project.color1 && project.color2 && project.color3 && project.color4 ? (
                // Use manually selected colors
                <UpdateColorsScript
                  uniformsRef={uniformsRef}
                  colors={[project.color1, project.color2, project.color3, project.color4]}
                />
              ) : (
                // Fall back to color extraction
                <ColorExtractor
                  imageUrl={project.coverUrl}
                  uniformsRef={uniformsRef}
                  isVisible={true}
                  projectId={project.id}
                />
              )}
            </>
          )}

          {/* Background Image */}
          <img
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
        </section>
      ))}
    </>
  );
}

// Component to update shader colors
function UpdateColorsScript({
  uniformsRef,
  colors,
}: {
  uniformsRef: MutableRefObject<ShaderUniforms | null>;
  colors: [string, string, string, string];
}) {
  useEffect(() => {
    if (uniformsRef.current) {
      colors.forEach((hexColor, index) => {
        const colorKey = `uColor${index + 1}` as keyof ShaderUniforms;
        if (uniformsRef.current && colorKey in uniformsRef.current) {
          const uniform = uniformsRef.current[colorKey];
          if (uniform && "value" in uniform) {
            uniform.value.setStyle(hexColor);
          }
        }
      });
      console.log("Updated project colors:", colors);
    }
  }, [colors, uniformsRef]);

  return null; // This component doesn't render anything
}

// === Style Definitions ===
// Add your styles here or move them to a separate CSS file

const fullScreenProjectSection: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
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
  color: "rgba(255, 200, 100, 0.8)",
  margin: 0,
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
};

const subtitle: CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.6,
  color: "rgba(255, 255, 255, 0.85)",
  margin: 0,
  fontFamily: "Space Grotesk, sans-serif",
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
