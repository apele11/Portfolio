import { useRef } from "react";
import HeroBackground from "../components/FragmentShader";
import Hero from "../components/Hero";
import NavBar from "../components/NavBar";
import Projects from "../components/Projects";
import ContactSection from "../components/contact/ContactSection";
import { useSeo, SITE_TITLE, SITE_DESCRIPTION } from "../seo";
import { VIEWPORT_HEIGHT } from "../viewport";


export default function Home() {
  const uniformsRef = useRef(null);

  // Restores the home tags after a client-side navigation back from a route
  // that set its own; index.html only covers the first paint.
  useSeo({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" });

  return (
    <>
      <div id={"hero"}>
        <HeroBackground uniformsRef={uniformsRef} />
      </div>
      <Hero uniformsRef={uniformsRef} />
      <NavBar />
      {/* Spacer for the fixed hero. Measured in the same unit as the panels
          below so the first one starts exactly one screen down.

          A real box with a height, not a top margin on the panels. Everything
          above is position: fixed, so a margin here collapsed through #root
          and <body>, moving the body itself one screen down once React
          mounted. Lighthouse caught the empty pre-mount frame and scored that
          jump as a 0.70 layout shift on <body>. */}
      <div aria-hidden="true" style={{ height: VIEWPORT_HEIGHT }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Projects uniformsRef={uniformsRef} />
        <ContactSection uniformsRef={uniformsRef} />
      </div>
    </>
  );
}