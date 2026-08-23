import type { CSSProperties } from "react";
import type { ProjectDetail } from "../../types/project";
import HeroBackground from "../../components/FragmentShader";
import CoverMedia from "../../components/CoverMedia";
import { useIsMobile } from "../../viewport";
import { formatProjectDate } from "../../data/projectDate";
import { describeTeam } from "../../data/projectTeam";
import "../styles.css";

interface DefaultProjectHeroProps {
  project: ProjectDetail;
  onBack: () => void;
  /**
   * Drop the cover on phones. Opt-in, because this hero has two jobs: inside a
   * case study it is a masthead over a body that opens with its own media, and
   * the cover costs 184px of a 812px screen to repeat what follows. Standalone
   * — the registry's fallback for projects with no bespoke layout — it *is* the
   * whole page, and without the cover there is nothing to look at.
   */
  hideCoverOnMobile?: boolean;
}

export default function DefaultProjectHero({ project, hideCoverOnMobile }: DefaultProjectHeroProps) {
  const isMobile = useIsMobile();
  // Not display:none — a hidden <video> with preload="auto" still pulls the
  // whole file down. Leaving it out of the tree is what saves the bytes.
  const showCover = Boolean(project.coverUrl) && !(hideCoverOnMobile && isMobile);
  return (
    <div className="project-page">
      <div
        className="hero-section"
        style={{
          "--color1": project.color1,
          "--color2": project.color2,
          "--color3": project.color3,
          "--color4": project.color4,
        } as CSSProperties}
      >
        <HeroBackground
          fixed={false}
          className="hero-shader"
          colors={[project.color1, project.color2, project.color3, project.color4]}
        />
        <div className="hero-overlay"></div>

        <div className="project-page-wrap">
          <div className="project-hero-title">
            <h1 className="title">{project.header}</h1>
          </div>

          <div className="hero-content">
            <div className="project-content-column">
              <p className="subtitle">{project.fullDescription}</p>

              {/* Role → Skills → Type → Date: what she did, what she did it
                  with, who she did it with, and when. */}
              <div className="hero-metadata">
                <div className="metadata-section">
                  <h4>Role</h4>
                  {project.role.map((roleItem, index) => (
                    <p key={index}>{roleItem}</p>
                  ))}
                </div>

                <div className="metadata-section">
                  <h4>Skills</h4>
                  {project.skills.map((skill, index) => (
                    <p key={index}>{skill}</p>
                  ))}
                </div>

                <div className="metadata-section">
                  <h4>Type</h4>
                  {describeTeam(project).map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>

                <div className="metadata-section">
                  <h4>Date</h4>
                  <p>{formatProjectDate(project.date)}</p>
                </div>
              </div>
            </div>

            {showCover && (
              <div className="project-image-column hero-image">
                <CoverMedia src={project.coverUrl} alt={project.header} eager />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
