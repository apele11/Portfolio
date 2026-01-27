import { useState, useEffect } from "react";
import type { MutableRefObject } from "react";
import { db } from "../firebase.js";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import AdminUI from "./AdminUI";
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

export default function Admin({
  onColorsChange,
  uniformsRef,
}: {
  onColorsChange: (colors: Colors) => void;
  uniformsRef: MutableRefObject<ColorUniforms | null>;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [colors, setColors] = useState<Colors>({
    c1: "#05060a",
    c2: "#2094C5",
    c3: "#b4532a",
    c4: "#d7c8a2",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from Firestore
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        // Load colors
        const colorsDoc = await getDoc(doc(db, "admin", "colors"));
        if (colorsDoc.exists()) {
          const savedColors = colorsDoc.data() as Colors;
          setColors(savedColors);
          onColorsChange(savedColors);
        }

        // Load projects
        const projectsSnap = await getDocs(collection(db, "projects"));
        const projectsList = projectsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setProjects(projectsList);
      } catch (error) {
        console.error("Error loading data:", error);
        const errorMsg = error instanceof Error ? error.message : "Failed to load data";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, onColorsChange]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace 'emily' with your desired password
    if (password === "emily") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={loginContainer}>
        <div style={loginBox}>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={loginContainer}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={loginContainer}>
        <div style={loginBox}>
          <h2 style={{ color: "#ff6b6b" }}>Connection Error</h2>
          <p>{error}</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
            Check your internet connection and make sure Firebase is configured correctly.
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsAuthenticated(false);
            }}
            style={buttonStyle}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminUI
      projects={projects}
      setProjects={setProjects}
      colors={colors}
      onLogout={() => setIsAuthenticated(false)}
      uniformsRef={uniformsRef}
    />
  );
}

const loginContainer: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 10000,
};

const loginBox: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
  minWidth: "300px",
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
