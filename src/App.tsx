import { useRef, useState, useEffect } from "react";
import HeroBackground from "./components/HeroBackground";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import Projects from "./components/Projects";
import Admin from "./components/Admin";
import { testConnection } from "./firebase";

export default function App() {
  const uniformsRef = useRef(null);
  const [showProjects, setShowProjects] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

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
      // Toggle admin with "Escape" key
      if (e.key === "Escape") {
        e.preventDefault();
        setShowAdmin((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <>
      <HeroBackground uniformsRef={uniformsRef} />
      <Hero uniformsRef={uniformsRef} />
      <NavBar />
      <div style={{ position: "relative", zIndex: 2, marginTop: "100vh" }}>
        {showProjects && <Projects uniformsRef={uniformsRef} />}
        {showAdmin && <Admin onColorsChange={() => {}} uniformsRef={uniformsRef} />}
      </div>
    </>
  );
}
