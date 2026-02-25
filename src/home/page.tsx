import { useRef, useState, useEffect } from "react";
import HeroBackground from "../components/HeroBackground";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import Admin from "../components/Admin";
import ProjectPage from "../projects/page";
import { testConnection } from "../firebase";


export default function Home() {
  const uniformsRef = useRef(null);
  const [showProjects, setShowProjects] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Test Firebase connection on app load
    testConnection();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle projects with "1" key
      if (e.key === "1") {
        e.preventDefault();
        setShowProjects((prev) => !prev);
      }
      // Toggle admin with "Escape" key - only in dev mode
      if (e.key === "Escape" && import.meta.env.DEV) {
        e.preventDefault();
        setShowAdmin((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleBackFromProject = () => {
    setSelectedProjectId(null);
  };

  return (
    <>
      {showAdmin ? (
        <>
          <Admin onClose={() => setShowAdmin(false)} />
        </>
      ) : (
        <>
        <div id={"hero"}>
          <HeroBackground uniformsRef={uniformsRef} />
          </div>
            <Hero uniformsRef={uniformsRef} />
          {!selectedProjectId && <NavBar onAdminClick={() => setShowAdmin(true)} />}
          <div style={{ position: "relative", zIndex: 2, marginTop: "100vh" }}>
            {selectedProjectId ? (
              <ProjectPage
                projectId={selectedProjectId}
                onBack={handleBackFromProject}
                onAdminClick={() => setShowAdmin(true)}
              />
            ) : showProjects ? (
              <Projects uniformsRef={uniformsRef} onProjectSelect={handleProjectSelect} />
            ) : null}
          </div>
        </>
      )}
    </>
  );
}