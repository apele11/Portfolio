import { useState, useEffect, type RefObject } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ProjectsFrontend, { type Project } from "./ProjectsFrontend";
import * as THREE from "three";
import { PLAYGROUND_ITEMS } from "../data/playground";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

export default function Projects({
  uniformsRef,
  onProjectSelect,
}: {
  uniformsRef?: RefObject<ShaderUniforms | null>;
  onProjectSelect?: (projectId: string) => void;
} = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects from Firestore with real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const projectsList = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as Project[];
        projectsList.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(projectsList);
        setLoading(false);
      },
      (error: Error) => {
        console.error("Error loading projects:", error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ProjectsFrontend
        projects={projects}
        loading={loading}
        uniformsRef={uniformsRef}
        onProjectSelect={onProjectSelect}
      />
      {!loading && <PlaygroundPreloader />}
    </>
  );
}

function PlaygroundPreloader() {
  const iframeItems = PLAYGROUND_ITEMS.filter(
    (item) => item.type === "iframe" && item.embedUrl
  );

  return (
    <div
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
        opacity: 0.01,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {iframeItems.map((item) => (
        <iframe
          key={item.id}
          src={item.embedUrl}
          title={`preload-${item.title}`}
          style={{ width: "1px", height: "1px", border: "none" }}
        />
      ))}
    </div>
  );
}