import { useState, useEffect, type MutableRefObject } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ProjectsFrontend, { type Project } from "./ProjectsFrontend";
import * as THREE from "three";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

export default function Projects({
  uniformsRef,
}: {
  uniformsRef?: MutableRefObject<ShaderUniforms | null>;
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
    <ProjectsFrontend
      projects={projects}
      loading={loading}
      uniformsRef={uniformsRef}
    />
  );
}