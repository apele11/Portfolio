import { useState } from "react";
import type { MutableRefObject } from "react";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ColorPicker from "./ColorPicker";
import * as THREE from "three";

interface Project {
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

interface Colors {
  c1: string;
  c2: string;
  c3: string;
  c4: string;
}

interface ColorUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

export default function AdminUI({
  projects,
  setProjects,
  colors,
  onLogout,
  uniformsRef,
}: {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  colors: Colors;
  onLogout: () => void;
  uniformsRef: MutableRefObject<ColorUniforms | null>;
}) {
  const [newProject, setNewProject] = useState({
    eyebrow: "",
    header: "",
    subtitle: "",
    coverUrl: "",
    color1: "#05060a",
    color2: "#2094C5",
    color3: "#b4532a",
    color4: "#d7c8a2",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    eyebrow: "",
    header: "",
    subtitle: "",
    coverUrl: "",
    color1: "#05060a",
    color2: "#2094C5",
    color3: "#b4532a",
    color4: "#d7c8a2",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProject.eyebrow ||
      !newProject.header ||
      !newProject.subtitle ||
      !newProject.coverUrl ||
      !newProject.color1 ||
      !newProject.color2 ||
      !newProject.color3 ||
      !newProject.color4
    ) {
      alert("Please fill in all fields and select colors");
      return;
    }

    const projectId = Date.now().toString();
    const project: Project = {
      id: projectId,
      ...newProject,
    };

    try {
      await setDoc(doc(db, "projects", projectId), newProject);
      setProjects([project, ...projects]);
      setNewProject({
        eyebrow: "",
        header: "",
        subtitle: "",
        coverUrl: "",
        color1: "#05060a",
        color2: "#2094C5",
        color3: "#b4532a",
        color4: "#d7c8a2",
      });
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const handleImageUpload = async (
    file: File,
    isNewProject: boolean = true
  ) => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `projects/${timestamp}-${file.name}`);

      // Simulate progress since uploadBytes doesn't provide progress events
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) return prev;
          return prev + Math.random() * 30;
        });
      }, 200);

      await uploadBytes(storageRef, file);
      clearInterval(progressInterval);
      setUploadProgress(95);

      const downloadUrl = await getDownloadURL(storageRef);
      setUploadProgress(100);

      if (isNewProject) {
        setNewProject({ ...newProject, coverUrl: downloadUrl });
      } else {
        setEditForm({ ...editForm, coverUrl: downloadUrl });
      }

      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 800);
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to upload image: ${errorMsg}`);
      setUploadProgress(0);
      setUploading(false);
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({
      eyebrow: project.eyebrow,
      header: project.header,
      subtitle: project.subtitle,
      coverUrl: project.coverUrl,
      color1: project.color1 || "#05060a",
      color2: project.color2 || "#2094C5",
      color3: project.color3 || "#b4532a",
      color4: project.color4 || "#d7c8a2",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      eyebrow: "",
      header: "",
      subtitle: "",
      coverUrl: "",
      color1: "#05060a",
      color2: "#2094C5",
      color3: "#b4532a",
      color4: "#d7c8a2",
    });
  };

  const handleUpdateProject = async (projectId: string) => {
    if (
      !editForm.eyebrow ||
      !editForm.header ||
      !editForm.subtitle ||
      !editForm.coverUrl ||
      !editForm.color1 ||
      !editForm.color2 ||
      !editForm.color3 ||
      !editForm.color4
    ) {
      alert("Please fill in all fields and select colors");
      return;
    }

    try {
      await setDoc(doc(db, "projects", projectId), editForm);
      setProjects(
        projects.map((p) =>
          p.id === projectId ? { ...p, ...editForm } : p
        )
      );
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  return (
    <div style={adminContainer}>
      <div style={adminContent}>
        <div style={header}>
          <h1>Admin Panel</h1>
          <button onClick={onLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>

        {/* Color Picker Section */}
        <section style={section}>
          <h2>Colors</h2>
          <ColorPicker uniformsRef={uniformsRef} colors={colors} />
        </section>

        {/* Projects Section */}
        <section style={section}>
          <h2>Projects</h2>

          {/* Add Project Form */}
          <form onSubmit={handleAddProject} style={form}>
            <h3>Add New Project</h3>
            <input
              type="text"
              placeholder="Eyebrow (category)"
              value={newProject.eyebrow}
              onChange={(e) =>
                setNewProject({ ...newProject, eyebrow: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.header}
              onChange={(e) =>
                setNewProject({ ...newProject, header: e.target.value })
              }
              style={inputStyle}
            />
            <textarea
              placeholder="Project Description"
              value={newProject.subtitle}
              onChange={(e) =>
                setNewProject({ ...newProject, subtitle: e.target.value })
              }
              style={textareaStyle}
            />
            <div style={uploadSection}>
              <label style={uploadLabel}>
                Upload Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(e.target.files[0], true);
                    }
                  }}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
              {uploading && (
                <div style={progressContainer}>
                  <div
                    style={{
                      ...progressBar,
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>
              )}
              {uploading && (
                <span style={{ fontSize: "12px" }}>
                  Uploading... {Math.round(uploadProgress)}%
                </span>
              )}
              {newProject.coverUrl && !uploading && (
                <p style={{ fontSize: "12px", color: "#2094C5" }}>
                  ✓ Image uploaded
                </p>
              )}
            </div>
            <input
              type="text"
              placeholder="Cover Image URL (or upload above)"
              value={newProject.coverUrl}
              onChange={(e) =>
                setNewProject({ ...newProject, coverUrl: e.target.value })
              }
              style={inputStyle}
            />
            {/* Color Pickers */}
            <div style={{ marginTop: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                Project Colors
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {([1, 2, 3, 4] as const).map((num) => (
                  <div key={num}>
                    <label style={{ display: "block", fontSize: "12px", marginBottom: "5px" }}>
                      Color {num}
                    </label>
                    <input
                      type="color"
                      value={newProject[`color${num}` as keyof typeof newProject] || "#000000"}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          [`color${num}`]: e.target.value,
                        } as typeof newProject)
                      }
                      style={{
                        width: "100%",
                        height: "40px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" style={buttonStyle}>
              Add Project
            </button>
          </form>

          {/* Projects List */}
          <div>
            <h3>Existing Projects ({projects.length})</h3>
            {projects.map((project) =>
              editingId === project.id ? (
                // Edit Form
                <div key={project.id} style={projectCard}>
                  <div style={{ width: "100%" }}>
                    <input
                      type="text"
                      placeholder="Eyebrow"
                      value={editForm.eyebrow}
                      onChange={(e) =>
                        setEditForm({ ...editForm, eyebrow: e.target.value })
                      }
                      style={{ ...inputStyle, marginBottom: "8px" }}
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={editForm.header}
                      onChange={(e) =>
                        setEditForm({ ...editForm, header: e.target.value })
                      }
                      style={{ ...inputStyle, marginBottom: "8px" }}
                    />
                    <textarea
                      placeholder="Description"
                      value={editForm.subtitle}
                      onChange={(e) =>
                        setEditForm({ ...editForm, subtitle: e.target.value })
                      }
                      style={{ ...textareaStyle, marginBottom: "8px" }}
                    />
                    <div style={uploadSection}>
                      <label style={uploadLabel}>
                        Update Cover Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], false);
                            }
                          }}
                          disabled={uploading}
                          style={{ display: "none" }}
                        />
                      </label>
                      {uploading && (
                        <div style={progressContainer}>
                          <div
                            style={{
                              ...progressBar,
                              width: `${uploadProgress}%`,
                            }}
                          />
                        </div>
                      )}
                      {uploading && (
                        <span style={{ fontSize: "12px" }}>
                          Uploading... {Math.round(uploadProgress)}%
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Cover Image URL (or upload above)"
                      value={editForm.coverUrl}
                      onChange={(e) =>
                        setEditForm({ ...editForm, coverUrl: e.target.value })
                      }
                      style={{ ...inputStyle, marginBottom: "8px" }}
                    />
                    {/* Color Pickers for Edit */}
                    <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "12px" }}>
                        Project Colors
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                        {([1, 2, 3, 4] as const).map((num) => (
                          <div key={num}>
                            <label style={{ display: "block", fontSize: "11px", marginBottom: "3px" }}>
                              Color {num}
                            </label>
                            <input
                              type="color"
                              value={editForm[`color${num}` as keyof typeof editForm] || "#000000"}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  [`color${num}`]: e.target.value,
                                } as typeof editForm)
                              }
                              style={{
                                width: "100%",
                                height: "35px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleUpdateProject(project.id)}
                        style={{ ...buttonStyle, flex: 1 }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          ...buttonStyle,
                          flex: 1,
                          backgroundColor: "#666",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Display Form
                <div key={project.id} style={projectCard}>
                  <div>
                    <strong>{project.header}</strong>
                    <p>{project.subtitle}</p>
                    <small>{project.eyebrow}</small>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleStartEdit(project)}
                      style={editButtonStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const adminContainer: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "500px",
  height: "100vh",
  backgroundColor: "#0f0f0f",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  overflowY: "auto",
  zIndex: 9999,
  boxShadow: "-5px 0 20px rgba(0, 0, 0, 0.5)",
};

const adminContent: React.CSSProperties = {
  padding: "20px",
  color: "#fff",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const section: React.CSSProperties = {
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const form: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  padding: "15px",
  borderRadius: "4px",
  marginBottom: "20px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#1a1a1a",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#fff",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "80px",
  resize: "vertical",
};

const uploadSection: React.CSSProperties = {
  marginBottom: "10px",
  padding: "10px",
  backgroundColor: "#1a1a1a",
  border: "1px solid rgba(255, 200, 100, 0.3)",
  borderRadius: "4px",
};

const uploadLabel: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  backgroundColor: "#2094C5",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

const progressContainer: React.CSSProperties = {
  width: "100%",
  height: "6px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
  marginBottom: "8px",
};

const progressBar: React.CSSProperties = {
  height: "100%",
  backgroundColor: "#2094C5",
  transition: "width 0.3s ease",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#2094C5",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "background-color 0.2s",
};

const deleteButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#d7534a",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
};

const editButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#2094C5",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#666",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
};

const projectCard: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  padding: "15px",
  borderRadius: "4px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
