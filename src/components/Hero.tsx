import { useEffect, useRef, useState, type MutableRefObject } from "react";
import type { CSSProperties } from "react";
import downArrowSrc from "../svg/down-arrow.svg";
import * as THREE from "three";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

const DEFAULT_COLORS = ["#19053d", "#2f7687", "#40aba2", "#6c6597"];

function resetShaderColors(uniformsRef: MutableRefObject<ShaderUniforms | null>) {
  if (uniformsRef.current) {
    DEFAULT_COLORS.forEach((hexColor, index) => {
      const colorKey = `uColor${index + 1}` as keyof ShaderUniforms;
      if (uniformsRef.current && colorKey in uniformsRef.current) {
        const uniform = uniformsRef.current[colorKey];
        if (uniform && "value" in uniform) {
          uniform.value.setStyle(hexColor);
          console.log(
            `[HERO] Set ${colorKey} to ${hexColor}`
          );
        }
      }
    });
    console.log("[HERO] Reset shader colors to default");
  }
}

export default function Hero({
  uniformsRef,
}: {
  uniformsRef?: MutableRefObject<ShaderUniforms | null>;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);

  // Reset colors when component mounts
  useEffect(() => {
    console.log("[HERO] Component mounted");
    if (uniformsRef) {
      resetShaderColors(uniformsRef);
    }
  }, [uniformsRef]);

  // Listen to scroll events to handle color reset and transitions
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      console.log(`[HERO] Scroll Y: ${currentScrollY}`);

      // Reset colors when at top of page (within 50px of top)
      if (currentScrollY < 50) {
        console.log("[HERO] At top of page, resetting colors");
        if (uniformsRef) {
          resetShaderColors(uniformsRef);
        }
      }

      // Calculate opacity and scale based on scroll position
      // Hero section is 100vh tall, so fade out/scale as user scrolls
      const maxScroll = window.innerHeight; // 100vh in pixels
      const scrollProgress = Math.min(currentScrollY / maxScroll, 1); // 0 to 1
      
      const newOpacity = Math.max(1 - scrollProgress, 0);
      const newScale = Math.max(1 - scrollProgress * 0.1, 0.9); // Scale from 1 to 0.9
      
      setOpacity(newOpacity);
      setScale(newScale);
      
      console.log(
        `[HERO] Scroll progress: ${scrollProgress.toFixed(2)}, Opacity: ${newOpacity.toFixed(2)}, Scale: ${newScale.toFixed(2)}`
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    console.log("[HERO] Scroll listener attached");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      console.log("[HERO] Scroll listener removed");
    };
  }, [uniformsRef]);
  return (
    <div id="hero" style={heroContainer} ref={heroRef}>
      <div style={{ ...content, opacity, transform: `scale(${scale})` }}>
        <h1 style={heading}>Emily Apel</h1>
        <p style={paragraph}>Immersive Experience Designer & Creative technologist</p>
      </div>
    <div style={{ ...downArrowWrap, opacity }} aria-hidden="true">
      <img src={downArrowSrc} alt="Down arrow" style={downArrowIcon} />
    </div>
    </div>
  );
}

const heroContainer: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  zIndex: 1,
};

const content: CSSProperties = {
  pointerEvents: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  maxWidth: "600px",
  padding: "40px 20px",
  transition: "opacity 0.3s ease, transform 0.3s ease",
};

const heading: CSSProperties = {
  fontSize: "50px",
  fontWeight: 700,
  marginBottom: "8px",
  margin: 0,
  fontFamily: "Against, sans-serif",
  letterSpacing: "0.2em",
};

const paragraph: CSSProperties = {
  fontSize: "16px",
  opacity: 0.9,
  lineHeight: 1.6,
  margin: 0,
};

const downArrowWrap: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: "32px",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  opacity: 0.8,
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
};

const downArrowIcon: CSSProperties = {
  width: "85px",
  height: "180px",
  display: "block",
  transform: "translateY(15px)",
};
