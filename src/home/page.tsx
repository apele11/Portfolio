import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroBackground from "../components/FragmentShader";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import { testConnection } from "../firebase";


export default function Home() {
  const uniformsRef = useRef(null);
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(true);

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
      // Navigate to admin with "Escape" key - only in dev mode
      if (e.key === "Escape" && import.meta.env.DEV) {
        e.preventDefault();
        navigate("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  const handleProjectSelect = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <>
      <div id={"hero"}>
        <HeroBackground uniformsRef={uniformsRef} />
      </div>
      <Hero uniformsRef={uniformsRef} />
      <NavBar />
      <div style={{ position: "relative", zIndex: 2, marginTop: "100vh" }}>
        {showProjects ? (
          <Projects uniformsRef={uniformsRef} onProjectSelect={handleProjectSelect} />
        ) : null}
      </div>
    </>
  );
}