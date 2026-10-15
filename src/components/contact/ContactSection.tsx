import { useEffect, useId, useState, type RefObject } from "react";
import type * as THREE from "three";
import ContactCard from "./ContactCard";
import { useContactReveal } from "./useContactReveal";
import "./contact.css";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

const COLOR_KEYS = ["uColor1", "uColor2", "uColor3", "uColor4"] as const;

/** The hero's own palette. Mirrors DEFAULT_COLORS in Hero.tsx. */
const HERO_PALETTE = ["#19053d", "#2f7687", "#40aba2", "#6c6597"] as const;

/**
 * The heading and card are set in the case studies' type, which the home page
 * does not otherwise load. Same URL as the @import in case-study.css, so a
 * visitor who has opened a study already has it cached.
 */
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..600&family=Jost:wght@300..700&family=IBM+Plex+Mono:wght@300;400;600;700&display=swap";

let fontsRequested = false;

function requestFonts() {
  if (fontsRequested) return;
  fontsRequested = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONTS_URL;
  document.head.appendChild(link);
}

interface ContactSectionProps {
  /** The fixed hero shader's uniforms, so the section can bring back the hero's palette. */
  uniformsRef?: RefObject<ShaderUniforms | null>;
}

/**
 * The Works page's closing section. A sheet of paper slides up over the fixed
 * hero shader with the EA monogram cut out of it, so the shader shows through
 * the letters. The cut-out dives through the E until the paper is gone, and the
 * heading splits to make room for the contact form. See useContactReveal for
 * the choreography.
 *
 * Under prefers-reduced-motion none of that runs. The section is one screen
 * tall, there is no paper, and the card sits under the heading.
 */
export default function ContactSection({ uniformsRef }: ContactSectionProps) {
  const headingId = useId();
  const [reduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const { sectionRef, panelRef, maskRef, contentRef, headingRef, leadRef, tailRef, cardRef } =
    useContactReveal(!reduceMotion);

  // Fonts are requested a screen before the section arrives rather than with
  // the page. A render-blocking stylesheet on the landing route, for type that
  // most visits never scroll far enough to see, is a poor trade.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        requestFonts();
        observer.disconnect();
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  // The project panels leave the shader in the last project's palette. Once
  // the paper covers the screen, the shader underneath goes back to the hero's
  // colours, so the page closes on the shader it opened with. Scrolling back up
  // hands back whatever palette was there before, which is what the last panel
  // expects to find.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !uniformsRef) return;

    let saved: THREE.Color[] | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const uniforms = uniformsRef.current;
        if (!uniforms) return;
        if (entry.isIntersecting && !saved) {
          saved = COLOR_KEYS.map((key) => uniforms[key].value.clone());
          COLOR_KEYS.forEach((key, i) => uniforms[key].value.setStyle(HERO_PALETTE[i]));
        } else if (!entry.isIntersecting && saved) {
          const previous = saved;
          COLOR_KEYS.forEach((key, i) => uniforms[key].value.copy(previous[i]));
          saved = null;
        }
      },
      // The root is the top 1% of the viewport: the section enters it once its
      // top edge has reached the top of the screen.
      { rootMargin: "0px 0px -99% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef, uniformsRef]);

  return (
    <section
      ref={sectionRef}
      className={reduceMotion ? "contact contact--static" : "contact"}
      aria-labelledby={headingId}
      data-nav-ink={reduceMotion ? undefined : "dark"}
    >
      <div ref={panelRef} className="contact__panel">
        <div ref={maskRef} className="contact__paper" aria-hidden="true" />

        <div ref={contentRef} className="contact__content">
          <h2 ref={headingRef} id={headingId} className="contact__heading">
            <span ref={leadRef}>Have an idea?</span>{" "}
            <span ref={tailRef}>Let's build it.</span>
          </h2>

          <div ref={cardRef} className="contact__card">
            <ContactCard />
          </div>
        </div>
      </div>
    </section>
  );
}
