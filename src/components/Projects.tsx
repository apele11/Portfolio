import { useState, useEffect, type RefObject } from "react";
import { db } from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import ProjectsFrontend, { type Project } from "./ProjectsFrontend";
import type * as THREE from "three";
import { PROJECTS_SNAPSHOT } from "../data/projects.snapshot";
import { cacheProjects, normalizeProjectDetail } from "../data/projects";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

export default function Projects({
  uniformsRef,
}: {
  uniformsRef?: RefObject<ShaderUniforms | null>;
} = {}) {
  // Seeded from the build-time snapshot so the grid paints real cards on the
  // first frame instead of a spinner. Firestore is still the source of truth —
  // whatever it returns replaces this.
  const [projects, setProjects] = useState<Project[]>(PROJECTS_SNAPSHOT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Normalized rather than spread raw, for two reasons: untrusted CMS data is
    // supposed to go through the normalizer, and normalizing here is what makes
    // these documents complete enough to cache. This read already pulls every
    // full project document — it was throwing the detail fields away on the way
    // to a card, and the project page then re-fetched the same document over
    // the network. Keeping them means opening a case study renders instantly.
    const toList = (docs: { id: string; data: () => unknown }[]) => {
      const details = docs
        .map((doc) => normalizeProjectDetail(doc.id, doc.data()))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      cacheProjects(details);
      return details as Project[];
    };

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
    />
  );
}
