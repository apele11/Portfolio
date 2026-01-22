import { useRef, useState, useEffect } from "react";
import HeroBackground from "./components/HeroBackground";
import Hero from "./components/Hero";
import ColorPicker from "./components/ColorPicker";
import NavBar from "./components/NavBar";
import Projects from "./components/Projects";

export default function App() {
  const uniformsRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [showProjects, setShowProjects] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle color picker with ":" key (shift + ; on US keyboard)
      if (e.key === ":" || (e.shiftKey && e.key === ";")) {
        e.preventDefault();
        setShowColorPicker((prev) => !prev);
      }
      // Toggle projects with "1" key
      if (e.key === "1") {
        e.preventDefault();
        setShowProjects((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <>{showProjects && <Projects />}
      <HeroBackground uniformsRef={uniformsRef} />
      <NavBar />
      <Hero />
      {showColorPicker && <ColorPicker uniformsRef={uniformsRef} />}
    </>
  );
}
