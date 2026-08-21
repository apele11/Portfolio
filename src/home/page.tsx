import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroBackground from "../components/FragmentShader";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import { warmPlaygroundEmbeds } from "../playgroundPrefetch";
import { VIEWPORT_HEIGHT } from "../viewport";


export default function Home() {
  const uniformsRef = useRef(null);
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(true);

  // Warm the playground embeds once the page has gone quiet, so the ~1s
  // third-party load is already paid for if the user heads there next.
  useEffect(() => {
    if (typeof requestIdleCallback === "function") {
      const handle = requestIdleCallback(warmPlaygroundEmbeds, { timeout: 4000 });
      return () => cancelIdleCallback(handle);
    }
    const timer = setTimeout(warmPlaygroundEmbeds, 2500);
    return () => clearTimeout(timer);
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
      {/* Spacer for the fixed hero. Measured in the same unit as the panels
          below so the first one starts exactly one screen down. */}
      <div style={{ position: "relative", zIndex: 2, marginTop: VIEWPORT_HEIGHT }}>
        {showProjects ? (
          <Projects uniformsRef={uniformsRef} onProjectSelect={handleProjectSelect} />
        ) : null}
      </div>
    </>
  );
}