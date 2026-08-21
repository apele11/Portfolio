import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { ProjectDetail } from "../../types/project";
import DefaultProjectHero from "../layouts/DefaultProjectHero";
import DiscoverMore from "./DiscoverMore";
import "./case-study.css";

interface CaseStudyLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
  /**
   * Which tone the paper diagrams and the label rail are drawn in. The default
   * warm system assumes a project whose palette is warm or violet; "cool"
   * re-derives both from the project's own colors for a navy/cyan palette,
   * against which cream cards read as foreign. See case-study.css.
   */
  tone?: "warm" | "cool";
  children: ReactNode;
}

/**
 * Shell for every hardcoded case study: the Firebase-driven shader hero on top,
 * then the "Editorial × Instrument" spine that the section primitives fill in.
 * The project's four colors become the body's skin via CSS custom properties.
 */
export default function CaseStudyLayout({ project, onBack, tone = "warm", children }: CaseStudyLayoutProps) {
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
      {/* The study below opens with its own media, so the phone doesn't need the
          cover repeated in the masthead. */}
      <DefaultProjectHero project={project} onBack={onBack} hideCoverOnMobile />
      {/* The case study's ground is paper-white, so the nav has to ink itself
          dark once it scrolls off the hero and over this. See NavBar. */}
      <main className="project-page case-study" data-nav-ink="dark" data-tone={tone} style={skin}>
        <div className="cs-study">
          {children}
          <DiscoverMore currentProjectId={project.id} />
        </div>
      </main>
    </>
  );
}
