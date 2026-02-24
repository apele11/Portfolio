import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { doc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import type { ProjectDetail, ProjectSection } from "../types/project";
import "./Admin.css";

export default function Admin({ onClose }: { onClose?: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Load projects from Firestore
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);
    const loadProjects = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const projectsList = projectsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProjectDetail[];
        setProjects(projectsList);
      } catch (error) {
        console.error("Error loading projects:", error);
        const errorMsg = error instanceof Error ? error.message : "Failed to load projects";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "emily") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  const handleAddProject = () => {
    const newProject: ProjectDetail = {
      id: new Date().getTime().toString(),
      eyebrow: "New Project",
      header: "Project Title",
      subtitle: "Subtitle",
      coverUrl: "",
      fullDescription: "",
      color1: "#05060a",
      color2: "#2094C5",
      color3: "#b4532a",
      color4: "#d7c8a2",
      role: [],
      type: "Solo",
      skills: [],
      date: new Date().toLocaleDateString(),
      sections: [],
    };
    setSelectedProject(newProject);
    setEditMode(true);
  };

  const handleEditProject = (project: ProjectDetail) => {
    setSelectedProject(project);
    setEditMode(true);
  };

  const handleSaveProject = async (updatedProject: ProjectDetail) => {
    if (!updatedProject.id) return;

    try {
      setLoading(true);
      await setDoc(doc(db, "projects", updatedProject.id), updatedProject);
      
      // Update local state
      const existingIndex = projects.findIndex(p => p.id === updatedProject.id);
      if (existingIndex >= 0) {
        const updated = [...projects];
        updated[existingIndex] = updatedProject;
        setProjects(updated);
      } else {
        setProjects([...projects, updatedProject]);
      }
      
      setEditMode(false);
      setSelectedProject(null);
      alert("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "projects", projectId));
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
      alert("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    if (!selectedProject) return;
    const newSection: ProjectSection = {
      id: new Date().getTime().toString(),
      type: "text",
      content: "",
    };
    setSelectedProject({
      ...selectedProject,
      sections: [...selectedProject.sections, newSection],
    });
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<ProjectSection>) => {
    if (!selectedProject) return;
    setSelectedProject({
      ...selectedProject,
      sections: selectedProject.sections.map(s =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!selectedProject) return;
    setSelectedProject({
      ...selectedProject,
      sections: selectedProject.sections.filter(s => s.id !== sectionId),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-top-bar">
        <h1>Admin Panel</h1>
        {onClose && (
          <button onClick={onClose} className="admin-close-btn">
            ✕ Close
          </button>
        )}
      </div>
      {error && <div className="error">{error}</div>}

      {!editMode ? (
        <div className="admin-projects-list">
          <div className="admin-header">
            <h2>Projects</h2>
            <button onClick={handleAddProject} className="btn-primary">
              Add Project
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <img src={project.coverUrl} alt={project.header} />
                  <div className="project-info">
                    <h3>{project.header}</h3>
                    <p>{project.subtitle}</p>
                    <div className="project-actions">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : selectedProject ? (
        <ProjectEditor
          project={selectedProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setEditMode(false);
            setSelectedProject(null);
          }}
          onAddSection={handleAddSection}
          onUpdateSection={handleUpdateSection}
          onRemoveSection={handleRemoveSection}
          loading={loading}
        />
      ) : null}
    </div>
  );
}

interface ProjectEditorProps {
  project: ProjectDetail;
  onSave: (project: ProjectDetail) => void;
  onCancel: () => void;
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updates: Partial<ProjectSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  loading: boolean;
}

function ProjectEditor({
  project,
  onSave,
  onCancel,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  loading,
}: ProjectEditorProps) {
  const [formData, setFormData] = useState<ProjectDetail>(project);

  const handleFieldChange = (field: keyof ProjectDetail, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleArrayFieldChange = (field: keyof ProjectDetail, index: number, value: string) => {
    const arrayField = formData[field] as string[];
    const updated = [...arrayField];
    updated[index] = value;
    handleFieldChange(field, updated);
  };

  const handleAddArrayItem = (field: keyof ProjectDetail) => {
    const arrayField = formData[field] as string[];
    handleFieldChange(field, [...arrayField, ""]);
  };

  const handleRemoveArrayItem = (field: keyof ProjectDetail, index: number) => {
    const arrayField = formData[field] as string[];
    handleFieldChange(
      field,
      arrayField.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="project-editor">
      <h2>Edit Project</h2>

      <div className="editor-section">
        <h3>Hero Section</h3>
        <div className="form-group">
          <label>Eyebrow</label>
          <input
            type="text"
            value={formData.eyebrow}
            onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.header}
            onChange={(e) => handleFieldChange("header", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => handleFieldChange("subtitle", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Full Description</label>
          <textarea
            value={formData.fullDescription}
            onChange={(e) => handleFieldChange("fullDescription", e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Cover Image URL</label>
          <input
            type="text"
            value={formData.coverUrl}
            onChange={(e) => handleFieldChange("coverUrl", e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Primary Color</label>
            <input
              type="color"
              value={formData.color1}
              onChange={(e) => handleFieldChange("color1", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Secondary Color</label>
            <input
              type="color"
              value={formData.color2}
              onChange={(e) => handleFieldChange("color2", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Tertiary Color</label>
            <input
              type="color"
              value={formData.color3}
              onChange={(e) => handleFieldChange("color3", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Quaternary Color</label>
            <input
              type="color"
              value={formData.color4}
              onChange={(e) => handleFieldChange("color4", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleFieldChange("type", e.target.value)}
            placeholder="e.g., Group, Solo, Collaboration"
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            placeholder="e.g., March, 2022"
          />
        </div>
      </div>

      <div className="editor-section">
        <h3>Roles</h3>
        {formData.role.map((role, index) => (
          <div key={index} className="array-item">
            <input
              type="text"
              value={role}
              onChange={(e) => handleArrayFieldChange("role", index, e.target.value)}
              placeholder="e.g., UX Designer"
            />
            <button
              onClick={() => handleRemoveArrayItem("role", index)}
              className="btn-danger-small"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => handleAddArrayItem("role")} className="btn-secondary">
          Add Role
        </button>
      </div>

      <div className="editor-section">
        <h3>Skills</h3>
        {formData.skills.map((skill, index) => (
          <div key={index} className="array-item">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleArrayFieldChange("skills", index, e.target.value)}
              placeholder="e.g., Unity 3D"
            />
            <button
              onClick={() => handleRemoveArrayItem("skills", index)}
              className="btn-danger-small"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => handleAddArrayItem("skills")} className="btn-secondary">
          Add Skill
        </button>
      </div>

      <div className="editor-section">
        <h3>Content Sections</h3>
        {formData.sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            onUpdate={onUpdateSection}
            onRemove={onRemoveSection}
          />
        ))}
        <button onClick={onAddSection} className="btn-secondary">
          Add Section
        </button>
      </div>

      <div className="editor-actions">
        <button
          onClick={() => onSave(formData)}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Saving..." : "Save Project"}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

interface SectionEditorProps {
  section: ProjectSection;
  index: number;
  onUpdate: (sectionId: string, updates: Partial<ProjectSection>) => void;
  onRemove: (sectionId: string) => void;
}

function SectionEditor({ section, index, onUpdate, onRemove }: SectionEditorProps) {
  return (
    <div className="section-editor">
      <div className="section-header">
        <h4>Section {index + 1}</h4>
        <button
          onClick={() => onRemove(section.id)}
          className="btn-danger-small"
        >
          Remove
        </button>
      </div>

      <div className="form-group">
        <label>Type</label>
        <select
          value={section.type}
          onChange={(e) =>
            onUpdate(section.id, { type: e.target.value as ProjectSection["type"] })
          }
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="html">Custom HTML</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          {section.type === "text" && "Text Content"}
          {section.type === "image" && "Image URL"}
          {section.type === "video" && "Video URL (embed or direct link)"}
          {section.type === "html" && "Custom HTML"}
        </label>
        {section.type === "html" ? (
          <textarea
            value={section.content}
            onChange={(e) => onUpdate(section.id, { content: e.target.value })}
            placeholder="Enter custom HTML..."
            rows={6}
          />
        ) : (
          <textarea
            value={section.content}
            onChange={(e) => onUpdate(section.id, { content: e.target.value })}
            rows={4}
          />
        )}
      </div>
    </div>
  );
}
