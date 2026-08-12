import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { ProjectDetail } from "../../types/project";
import DefaultProjectHero from "../layouts/DefaultProjectHero";
import DiscoverMore from "./DiscoverMore";
import "./case-study.css";

interface CaseStudyLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
  children: ReactNode;
}

/**
 * Shell for every hardcoded case study: the Firebase-driven shader hero on top,
 * then the "Editorial × Instrument" spine that the section primitives fill in.
 * The project's four colors become the body's skin via CSS custom properties.
 */
export default function CaseStudyLayout({ project, onBack, children }: CaseStudyLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const skin = {
    "--c1": project.color1,
    "--c2": project.color2,
    "--c3": project.color3,
    "--c4": project.color4,
  } as CSSProperties;

  return (
    <>
      <DefaultProjectHero project={project} onBack={onBack} />
      {/* The case study's ground is paper-white, so the nav has to ink itself
          dark once it scrolls off the hero and over this. See NavBar. */}
      <main className="project-page case-study" data-nav-ink="dark" style={skin}>
        <div className="cs-study">
          {children}
          <DiscoverMore currentProjectId={project.id} />
        </div>
      </main>
    </>
  );
}
