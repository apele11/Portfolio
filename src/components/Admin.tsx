import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { auth } from "../auth";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import type { ProjectDetail } from "../types/project";
import { normalizeProjectDetail } from "../data/projects";
import { defaultDateRange } from "../data/projectDate";
import {
  DEFAULT_SCRIM_STRENGTH,
  DEFAULT_SCRIM_WIDTH,
  coverScrimGradient,
} from "../data/coverScrim";
import CoverMedia from "./CoverMedia";
import "./Admin.css";

/** Firebase auth errors carry a `code`; map the ones worth explaining. */
function authErrorMessage(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error ? String(error.code) : "";

  switch (code) {
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error — check your connection.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled for this Firebase project. Enable it in Firebase Console → Authentication → Sign-in method.";
    default:
      return error instanceof Error ? error.message : "Sign-in failed.";
  }
}

/**
 * Reorder writes touch exactly one field.
 *
 * Spreading a whole ProjectDetail here instead sends `teamSize: undefined` for
 * every document without a headcount — normalizeProjectDetail always emits the
 * key — and Firestore rejects undefined values outright unless the client opts
 * into ignoring them. That rejected the whole write, which is why reordering
 * appeared to work until the next reload and then snapped back.
 */
function writeOrder(projectId: string, order: number): Promise<void> {
  return setDoc(doc(db, "projects", projectId), { order }, { merge: true });
}

/**
 * Renumber a sorted list to a contiguous 0..n-1 sequence, reporting which
 * documents actually moved.
 *
 * `order` drifts out of shape on its own: a delete leaves a hole, and the move
 * handler used to write array indices, which land on numbers other documents
 * already hold. The duplicate is the damaging half — two documents sharing an
 * `order` sort against each other arbitrarily, so the grid can reshuffle
 * between reads and pressing the arrows cannot separate them.
 *
 * Pure, and idempotent by construction: run against a clean sequence it reports
 * nothing changed.
 */
function renumberProjects(sorted: ProjectDetail[]): {
  projects: ProjectDetail[];
  changed: { id: string; order: number }[];
} {
  const changed: { id: string; order: number }[] = [];
  const projects = sorted.map((project, index) => {
    if (project.order === index) return project;
    changed.push({ id: project.id, order: index });
    return { ...project, order: index };
  });
  return { projects, changed };
}

export default function Admin({ onClose }: { onClose?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Firebase persists the session, so a reload restores it rather than bouncing
  // back to the login form. `authChecked` avoids flashing that form in the gap.
  useEffect(
    () =>
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setAuthChecked(true);
      }),
    []
  );

  // Load projects from Firestore
  useEffect(() => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError(null);
    const loadProjects = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const projectsList = projectsSnap.docs.map((doc) =>
          normalizeProjectDetail(doc.id, doc.data())
        );
        projectsList.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Renumbering preserves the sequence, so `ordered` renders identically
        // to `projectsList` — only the stored numbers differ. Showing it right
        // away keeps the repair write off the critical path.
        const { projects: ordered, changed } = renumberProjects(projectsList);
        setProjects(ordered);

        if (changed.length > 0) {
          // Self-healing rather than a one-shot script: `order` drifts again
          // every time a document is deleted, and this is the one place that
          // reads the whole collection. Once contiguous it finds nothing, so
          // later opens cost a single pass and no writes.
          console.info(
            `Project order is not contiguous — renumbering ${changed.length} document(s).`
          );
          try {
            await Promise.all(changed.map(({ id, order }) => writeOrder(id, order)));
          } catch (orderError) {
            // Fall back to the documents' real stored values, so a subsequent
            // move trades numbers that actually exist in Firestore.
            console.error("Failed to repair project order:", orderError);
            setProjects(projectsList);
          }
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        const errorMsg = error instanceof Error ? error.message : "Failed to load projects";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch (error) {
      setAuthError(authErrorMessage(error));
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProjects([]);
      setSelectedProject(null);
      setEditMode(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleAddProject = () => {
    // One past the highest `order` in use, not `projects.length` — the two only
    // agree while the sequence is gapless, and it is not: a delete leaves a hole,
    // so a length-based number collides with a document that already holds it.
    // Two documents sharing an `order` sort against each other arbitrarily.
    const nextOrder =
      projects.reduce((max, project) => Math.max(max, project.order ?? 0), -1) + 1;

    const newProject: ProjectDetail = {
      id: new Date().getTime().toString(),
      // Seeded empty rather than with sample copy. These strings are written to
      // Firestore verbatim on save, so a placeholder left unedited ships to the
      // live grid as the project's actual title; an empty field is visibly unfinished.
      eyebrow: "",
      header: "",
      subtitle: "",
      coverUrl: "",
      fullDescription: "",
      color1: "#05060a",
      color2: "#2094C5",
      color3: "#b4532a",
      color4: "#d7c8a2",
      role: [],
      type: "Solo",
      skills: [],
      team: [],
      date: defaultDateRange(),
      scrimStrength: DEFAULT_SCRIM_STRENGTH,
      scrimWidth: DEFAULT_SCRIM_WIDTH,
      order: nextOrder,
    };
    setSelectedProject(newProject);
    setEditMode(true);
  };

  const handleMoveProject = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === projects.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const moving = projects[index];
    const displaced = projects[newIndex];

    // Trade the two documents' *stored* `order` values. Writing array indices
    // instead only works while the sequence is gapless from zero, and it does
    // not stay that way — see renumberProjects. The load pass keeps it
    // contiguous, so these fallbacks should never fire.
    const movingOrder = moving.order ?? index;
    const displacedOrder = displaced.order ?? newIndex;

    // Fresh objects: `[...projects]` is a shallow copy, so assigning `order`
    // through it would mutate the objects still held in the current state.
    const previous = projects;
    const newProjects = [...projects];
    newProjects[index] = { ...displaced, order: movingOrder };
    newProjects[newIndex] = { ...moving, order: displacedOrder };

    setProjects(newProjects);

    try {
      setLoading(true);
      await writeOrder(moving.id, displacedOrder);
      await writeOrder(displaced.id, movingOrder);
    } catch (error) {
      console.error("Error updating project order:", error);
      // The optimistic swap above is now a lie about what Firestore holds.
      setProjects(previous);
      alert("Failed to update project order");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project: ProjectDetail) => {
    setSelectedProject(project);
    setEditMode(true);
  };

  const handleSaveProject = async (updatedProject: ProjectDetail) => {
    if (!updatedProject.id) return;

    try {
      setLoading(true);
      // Firestore rejects `undefined` outright, and the optional fields
      // (teamSize) are undefined on every document that has not set one — so
      // drop those keys rather than writing them.
      const payload = Object.fromEntries(
        Object.entries(updatedProject).filter(([, value]) => value !== undefined)
      );
      await setDoc(doc(db, "projects", updatedProject.id), payload);

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

  if (!authChecked) {
    return (
      <div className="admin-login">
        <p>Checking sign-in…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button type="submit" disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
          {authError && <div className="error">{authError}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-top-bar">
        <h1>Admin Panel</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* The UID is shown because firestore.rules pins write access to it —
              copy it from here when setting the rules up. */}
          <span style={{ fontSize: "12px", opacity: 0.7 }}>
            {user.email} · uid <code>{user.uid}</code>
          </span>
          <button onClick={handleLogout} className="btn-secondary">
            Sign out
          </button>
          {onClose && (
            <button onClick={onClose} className="admin-close-btn">
              ✕ Close
            </button>
          )}
        </div>
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
              {projects.map((project, index) => (
                <div key={project.id} className="project-card">
                  <CoverMedia src={project.coverUrl} alt={project.header} />
                  <div className="project-info">
                    <h3>{project.header}</h3>
                    <p>{project.subtitle}</p>
                    <div className="project-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleMoveProject(index, "up")}
                        disabled={index === 0}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveProject(index, "down")}
                        disabled={index === projects.length - 1}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        ↓
                      </button>
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
          isNew={!projects.some((p) => p.id === selectedProject.id)}
          onSave={handleSaveProject}
          onCancel={() => {
            setEditMode(false);
            setSelectedProject(null);
          }}
          loading={loading}
        />
      ) : null}
    </div>
  );
}

/**
 * The two knobs on the home grid's cover scrim, over a live preview of the
 * actual cover at the actual proportions.
 *
 * A preview rather than two bare number inputs because the thing being tuned is
 * "can you read the title" — a judgement nobody can make from `0.82`. The
 * dummy type is positioned the way ProjectsFrontend positions the real thing
 * (left 15%, width 30% of a viewport whose cover spans 25%–75%), so what the
 * strip shows is what the grid does.
 */
function CoverScrimField({
  coverUrl,
  strength,
  width,
  onChange,
}: {
  coverUrl: string;
  strength: number;
  width: number;
  onChange: <K extends keyof ProjectDetail>(field: K, value: ProjectDetail[K]) => void;
}) {
  const gradient = coverScrimGradient(strength, width);
  const isVideo = /\.(mp4|webm|mov)$/i.test(coverUrl);
  const isDefault = strength === DEFAULT_SCRIM_STRENGTH && width === DEFAULT_SCRIM_WIDTH;

  return (
    <div className="form-group">
      <label>
        Cover scrim{" "}
        <span style={{ fontWeight: 400, opacity: 0.7, fontSize: "12px" }}>
          — darkens the cover behind the title on the home grid
        </span>
      </label>

      <div className="scrim-preview">
        {coverUrl ? (
          isVideo ? (
            <video className="scrim-preview-media" src={coverUrl} muted playsInline autoPlay loop />
          ) : (
            <img className="scrim-preview-media" src={coverUrl} alt="" />
          )
        ) : (
          <div className="scrim-preview-media scrim-preview-empty">no cover set</div>
        )}
        {gradient && <div className="scrim-preview-scrim" style={{ background: gradient }} />}
        {/* Stand-in for the grid's text column, at the same relative position. */}
        <div className="scrim-preview-text">
          <span className="scrim-preview-eyebrow">EYEBROW</span>
          <span className="scrim-preview-title">PROJECT TITLE</span>
          <span className="scrim-preview-subtitle">The subtitle sits here, at 16px.</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Strength <code>{strength.toFixed(2)}</code>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={strength}
            onChange={(e) => onChange("scrimStrength", Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>
            Width <code>{Math.round(width * 100)}%</code>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={width}
            onChange={(e) => onChange("scrimWidth", Number(e.target.value))}
          />
        </div>
      </div>

      <p className="scrim-hint">
        Width 0 removes the scrim entirely. The text column reaches 40% of the
        cover, so a width below that leaves the end of the title unprotected.
        {!isDefault && (
          <>
            {" "}
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                onChange("scrimStrength", DEFAULT_SCRIM_STRENGTH);
                onChange("scrimWidth", DEFAULT_SCRIM_WIDTH);
              }}
            >
              Reset to default
            </button>
          </>
        )}
      </p>
    </div>
  );
}

interface ProjectEditorProps {
  project: ProjectDetail;
  /** Creating rather than editing — only changes the heading and the save label. */
  isNew: boolean;
  onSave: (project: ProjectDetail) => void;
  onCancel: () => void;
  loading: boolean;
}

function ProjectEditor({
  project,
  isNew,
  onSave,
  onCancel,
  loading,
}: ProjectEditorProps) {
  const [formData, setFormData] = useState<ProjectDetail>({
    ...project,
    eyebrow: project.eyebrow || "",
    header: project.header || "",
    subtitle: project.subtitle || "",
    fullDescription: project.fullDescription || "",
    coverUrl: project.coverUrl || "",
    color1: project.color1 || "#05060a",
    color2: project.color2 || "#2094C5",
    color3: project.color3 || "#b4532a",
    color4: project.color4 || "#d7c8a2",
    type: project.type || "",
    date: project.date || "",
    role: project.role || [],
    skills: project.skills || [],
    team: project.team || [],
    teamSize: project.teamSize,
    scrimStrength: project.scrimStrength ?? DEFAULT_SCRIM_STRENGTH,
    scrimWidth: project.scrimWidth ?? DEFAULT_SCRIM_WIDTH,
  });

  // Functional update, not a spread of the captured `formData`: the scrim's
  // "Reset to default" sets two fields back to back, and against a snapshot the
  // second call would be built from the pre-reset state and drop the first.
  const handleFieldChange = <K extends keyof ProjectDetail>(field: K, value: ProjectDetail[K]) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
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
      <h2>{isNew ? "New Project" : `Edit ${project.header || "Project"}`}</h2>

      <div className="editor-section">
        <h3>Hero Section</h3>
        <div className="form-group">
          <label>Eyebrow</label>
          <input
            type="text"
            value={formData.eyebrow}
            onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
            placeholder="e.g., Unity, VR — the tech, shown above the title"
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.header}
            onChange={(e) => handleFieldChange("header", e.target.value)}
            placeholder="e.g., Twix Game — also what the layout registry matches on"
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => handleFieldChange("subtitle", e.target.value)}
            placeholder="One line describing the project"
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
          <label>Cover URL (image or video)</label>
          <input
            type="text"
            value={formData.coverUrl}
            onChange={(e) => handleFieldChange("coverUrl", e.target.value)}
            placeholder="/assets/compressed/<Project>/<file>.webp"
          />
        </div>

        <CoverScrimField
          coverUrl={formData.coverUrl}
          strength={formData.scrimStrength ?? DEFAULT_SCRIM_STRENGTH}
          width={formData.scrimWidth ?? DEFAULT_SCRIM_WIDTH}
          onChange={handleFieldChange}
        />

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
          <label>Team size</label>
          <input
            type="number"
            min={1}
            value={formData.teamSize ?? ""}
            onChange={(e) =>
              handleFieldChange("teamSize", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="e.g., 8 — renders as “Group of 8”"
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            placeholder="e.g., Aug - Dec, 2025 — always a start and an end"
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
        <h3>Team</h3>
        {/* Optional. Naming people derives the headcount, so filling this in
            makes the "Team size" field above redundant. */}
        {(formData.team ?? []).map((member, index) => (
          <div key={index} className="array-item">
            <input
              type="text"
              value={member}
              onChange={(e) => handleArrayFieldChange("team", index, e.target.value)}
              placeholder="e.g., Ada Lovelace"
            />
            <button
              onClick={() => handleRemoveArrayItem("team", index)}
              className="btn-danger-small"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => handleAddArrayItem("team")} className="btn-secondary">
          Add Team Member
        </button>
      </div>

      <div className="editor-actions">
        <button
          onClick={() => onSave(formData)}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Saving..." : isNew ? "Create Project" : "Save Project"}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
