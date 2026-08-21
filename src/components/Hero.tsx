import { useEffect, useRef, useState, type MutableRefObject } from "react";
import type { CSSProperties } from "react";
import downArrowSrc from "../svg/down-arrow.svg";
import type * as THREE from "three";

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
        }
      }
    });
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
    if (uniformsRef) {
      resetShaderColors(uniformsRef);
    }
  }, [uniformsRef]);

  // Listen to scroll events to handle color reset and transitions
  useEffect(() => {
    // Coalesced into a frame. This handler re-renders the hero through two
    // pieces of state, and a phone fires scroll far faster than it paints, so
    // running it raw meant several React renders per frame on the one device
    // least able to afford them.
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const currentScrollY = window.scrollY;

        // Reset colors when at top of page (within 50px of top)
        if (currentScrollY < 50 && uniformsRef) {
          resetShaderColors(uniformsRef);
        }

        // Calculate opacity and scale based on scroll position
        // Hero section is one viewport tall, so fade out/scale as user scrolls
        const maxScroll = window.innerHeight * 0.7; // Faster transition over less scroll distance
        const scrollProgress = Math.min(currentScrollY / maxScroll, 1); // 0 to 1

        setOpacity(Math.max(1 - scrollProgress, 0));
        setScale(Math.max(1 - scrollProgress * 0.1, 0.9)); // Scale from 1 to 0.9
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [uniformsRef]);
  return (
    <div style={heroContainer} ref={heroRef}>
      <div style={{ ...content, opacity, transform: `scale(${scale})` }}>
        <h1 style={heading}>EMILY APEL</h1>
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
  //backgroundColor: "#000",
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
  transition: "opacity 0.18s ease-out, transform 0.18s ease-out",
};

const heading: CSSProperties = {
  // Was a flat 6rem. At 375px that wrapped "EMILY APEL" onto two 96px lines and
  // spent 240px of an 812px-tall screen on the wordmark alone; the floor here
  // keeps it to one line down to about 340px of width.
  fontSize: "clamp(2.75rem, 12.5vw, 6rem)",
  fontWeight: 700,
  marginBottom: "0.5rem",
  margin: 0,
  fontFamily: "Aetherin, sans-serif",
  letterSpacing: "0.2em",
  alignItems: "center",
  lineHeight: "1.25",

};

const paragraph: CSSProperties = {
  fontSize: "16px",
  fontFamily: '"Space Grotesk", sans-serif',
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
  transition: "opacity 0.18s ease-out",
};

const downArrowIcon: CSSProperties = {
  // Same 85:180 ratio the desktop size draws, scaled down for narrow screens
  // where a 180px-tall arrow is a fifth of the viewport.
  width: "clamp(44px, 11.5vw, 85px)",
  height: "clamp(93px, 24.4vw, 180px)",
  display: "block",
  transform: "translateY(15px)",
};
