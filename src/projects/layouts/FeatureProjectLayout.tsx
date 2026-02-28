import type { CSSProperties } from "react";
import type { ProjectDetail } from "../../types/project";
import HeroBackground from "../../components/FragmentShader";
import "../styles.css";

interface FeatureProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function FeatureProjectLayout({ project, onBack }: FeatureProjectLayoutProps) {
  return (
    <div className="project-page">
      <button onClick={onBack} className="back-button">
        ← Back
      </button>

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
        <div className="project-page-wrap">
          <div className="project-hero-title">
            <h1 className="title">{project.header}</h1>
          </div>

          <div className="hero-content" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="project-content-column">
              <p className="subtitle">{project.subtitle}</p>
              <p className="full-description">{project.fullDescription}</p>
            </div>

            {project.coverUrl && (
              <div className="project-image-column hero-image">
                <img src={project.coverUrl} alt={project.header} />
              </div>
            )}
          </div>
        </div>
      </div>

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

          <div className="hero-metadata" style={{ marginTop: 0 }}>
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
              <p>{project.date}</p>
            </div>

            <div className="metadata-section">
              <h4>Skills</h4>
              {project.skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
