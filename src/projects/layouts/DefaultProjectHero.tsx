import type { CSSProperties } from "react";
import type { ProjectDetail } from "../../types/project";
import HeroBackground from "../../components/FragmentShader";
import "../styles.css";

interface DefaultProjectHeroProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function DefaultProjectHero({ project }: DefaultProjectHeroProps) {
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

              <div className="hero-metadata">
                <div className="metadata-section">
                  <h4>Role</h4>
                  {project.role.map((roleItem, index) => (
                    <p key={index}>{roleItem}</p>
                  ))}
                </div>

                <div className="metadata-section">
                  <h4>Type</h4>
                  <p>{project.type}</p>
                </div>

                <div className="metadata-section">
                  <h4>Date</h4>
                  <p>
                    {(() => {
                      if (!project.date) return "";

                      const formatSingleDate = (dateStr: string) => {
                        const d = new Date(dateStr.trim());
                        if (isNaN(d.getTime())) return dateStr.trim(); // Fallback
                        const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
                        const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: "UTC" });
                        return `${month}, ${year}`;
                      };

                      // Support "date1 - date2" or "date1 to date2" formats
                      if (project.date.includes(" - ")) {
                        return project.date.split(" - ").map(formatSingleDate).join(" – ");
                      } else if (project.date.toLowerCase().includes(" to ")) {
                        return project.date.split(/ to /i).map(formatSingleDate).join(" – ");
                      }

                      return formatSingleDate(project.date);
                    })()}
                  </p>
                </div>

                <div className="metadata-section">
                  <h4>Skills</h4>
                  {project.skills.map((skill, index) => (
                    <p key={index}>{skill}</p>
                  ))}
                </div>
              </div>
            </div>

            {project.coverUrl && (
              <div className="project-image-column hero-image">
                <img src={project.coverUrl} alt={project.header} />
              </div>
            )}
          </div>

        </div>
      </div>

      {project.sections && project.sections.length > 0 && (
        <div className="project-page-wrap">
          <div className="content-sections">
            {project.sections.map((section) => (
              <div key={section.id} className={`section section-${section.type}`}>
                {section.type === "text" && <p className="section-text">{section.content}</p>}
                {section.type === "image" && (
                  <img src={section.content} alt="Project content" className="section-image" />
                )}
                {section.type === "video" && (
                  <iframe
                    className="section-video"
                    src={section.content}
                    title="Project video"
                    allowFullScreen
                  />
                )}
                {section.type === "html" && (
                  <div className="section-html" dangerouslySetInnerHTML={{ __html: section.content }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
