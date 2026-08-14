import { useState, useEffect, type RefObject } from "react";
import { db } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import ProjectsFrontend, { type Project } from "./ProjectsFrontend";
import type * as THREE from "three";
import { PROJECTS_SNAPSHOT } from "../data/projects.snapshot";

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
  // Seeded from the build-time snapshot so the grid paints real cards on the
  // first frame instead of a spinner. Firestore is still the source of truth —
  // whatever it returns replaces this.
  const [projects, setProjects] = useState<Project[]>(PROJECTS_SNAPSHOT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const toList = (docs: { id: string; data: () => unknown }[]) =>
      (docs.map((doc) => ({ id: doc.id, ...(doc.data() as object) })) as Project[]).sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );

    const onError = (error: Error) => {
      console.error("Error loading projects:", error.message);
      setLoaded(true);
    };

    // Real-time updates only in dev, where the admin panel edits documents and
    // the grid should reflect changes live. Production content only changes on
    // deploy, so it takes the cheaper one-shot read (no WebChannel handshake).
    if (import.meta.env.DEV) {
      const unsubscribe = onSnapshot(
        collection(db, "projects"),
        (snapshot) => {
          setProjects(toList(snapshot.docs));
          setLoaded(true);
        },
        onError
      );
      return () => unsubscribe();
    }

    let cancelled = false;
    getDocs(collection(db, "projects"))
      .then((snapshot) => {
        if (cancelled) return;
        setProjects(toList(snapshot.docs));
        setLoaded(true);
      })
      .catch(onError);

    return () => {
      cancelled = true;
    };
  }, []);

  // Only a cold start with no usable snapshot can still show the spinner.
  const loading = !loaded && projects.length === 0;

  return (
    <ProjectsFrontend
      projects={projects}
      loading={loading}
      uniformsRef={uniformsRef}
      onProjectSelect={onProjectSelect}
    />
  );
}
