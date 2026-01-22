import { useState } from "react";
import type { CSSProperties } from "react";

interface Project {
  id: string;
  eyebrow: string;
  header: string;
  subtitle: string;
  coverUrl: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    eyebrow: "",
    header: "",
    subtitle: "",
    coverUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.eyebrow ||
      !formData.header ||
      !formData.subtitle ||
      !formData.coverUrl
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      ...formData,
    };

    setProjects((prev) => [newProject, ...prev]);
    setFormData({
      eyebrow: "",
      header: "",
      subtitle: "",
      coverUrl: "",
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return (
    <section style={projectsSection}>
      <div style={container}>
        <h2 style={sectionTitle}>Projects</h2>

        {/* Form */}
        <form style={form} onSubmit={handleAddProject}>
          <div style={formGroup}>
            <label style={label}>Eyebrow</label>
            <input
              type="text"
              name="eyebrow"
              value={formData.eyebrow}
              onChange={handleInputChange}
              placeholder="e.g., Web3D, APP"
              style={input}
            />
          </div>

          <div style={formGroup}>
            <label style={label}>Header</label>
            <input
              type="text"
              name="header"
              value={formData.header}
              onChange={handleInputChange}
              placeholder="Project title"
              style={input}
            />
          </div>

          <div style={formGroup}>
            <label style={label}>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Brief description"
              style={input}
            />
          </div>

          <div style={formGroup}>
            <label style={label}>Cover Image URL</label>
            <input
              type="text"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              style={input}
            />
          </div>

          <button type="submit" style={submitButton}>
            Add Project
          </button>
        </form>

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div style={projectsGrid}>
            {projects.map((project) => (
              <div key={project.id} style={projectCard}>
                <div style={coverImageContainer}>
                  <img
                    src={project.coverUrl}
                    alt={project.header}
                    style={coverImage}
                  />
                </div>
                <div style={projectContent}>
                  <p style={eyebrow}>{project.eyebrow}</p>
                  <h3 style={projectHeader}>{project.header}</h3>
                  <p style={projectSubtitle}>{project.subtitle}</p>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    style={deleteButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && (
          <p style={emptyState}>No projects yet. Add your first project!</p>
        )}
      </div>
    </section>
  );
}

const projectsSection: CSSProperties = {
  padding: "80px 0",
  backgroundColor: "#0f0f0f",
};

const container: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 2rem",
};

const sectionTitle: CSSProperties = {
  fontSize: "42px",
  fontWeight: 700,
  color: "white",
  marginBottom: "60px",
  fontFamily: "Against, sans-serif",
  letterSpacing: "0.05em",
};

const form: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  padding: "40px",
  borderRadius: "8px",
  marginBottom: "60px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
};

const formGroup: CSSProperties = {
  marginBottom: "24px",
};

const label: CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.8)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: '"Space Grotesk", sans-serif',
};

const input: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  fontSize: "14px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "4px",
  color: "white",
  fontFamily: 'inherit',
  boxSizing: "border-box",
  transition: "all 0.3s ease",
  outline: "none",
};

const submitButton: CSSProperties = {
  padding: "12px 32px",
  fontSize: "14px",
  fontWeight: 600,
  color: "white",
  backgroundColor: "rgba(255, 200, 100, 0.8)",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: '"Space Grotesk", sans-serif',
  transition: "all 0.3s ease",
};

const projectsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "40px",
  marginTop: "60px",
};

const projectCard: CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
};

const coverImageContainer: CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
};

const coverImage: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const projectContent: CSSProperties = {
  padding: "24px",
};

const eyebrow: CSSProperties = {
  fontSize: "12px",
  color: "rgba(255, 200, 100, 0.8)",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  margin: 0,
  marginBottom: "8px",
  fontWeight: 600,
  fontFamily: '"Space Grotesk", sans-serif',
};

const projectHeader: CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "white",
  margin: 0,
  marginBottom: "8px",
  fontFamily: "Against, sans-serif",
};

const projectSubtitle: CSSProperties = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.7)",
  lineHeight: 1.6,
  margin: 0,
  marginBottom: "16px",
};

const deleteButton: CSSProperties = {
  padding: "8px 16px",
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.7)",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "4px",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontFamily: '"Space Grotesk", sans-serif',
  transition: "all 0.3s ease",
};

const emptyState: CSSProperties = {
  textAlign: "center",
  fontSize: "16px",
  color: "rgba(255, 255, 255, 0.5)",
  padding: "40px",
  fontStyle: "italic",
};