import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis virtualizes the page scroll and eases it toward the wheel position, so
 * the whole page carries momentum rather than snapping to the scrollbar. Every
 * scroll-linked animation inherits that drag for free — the ScrollTrigger
 * `scrub` values are layered on top of it.
 *
 * The instance is a module singleton because it owns the document scroll: two
 * of them would each run their own RAF loop and fight over scrollTop. Anything
 * that needs to move the page must go through `scrollToTop`, not
 * `window.scrollTo` — a native smooth scroll runs its own interpolation and
 * Lenis overwrites it on the next frame, which reads as a stutter or a refusal
 * to move at all.
 */
let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export function scrollToTop(smooth = true) {
  if (lenis) {
    lenis.scrollTo(0, { immediate: !smooth });
    return;
  }
  window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      // Seconds to settle. Higher is heavier; this is the friction dial.
      duration: 1.2,
      // Exponential ease-out: fast pickup, long tail.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      // Touch devices already have native inertia; smoothing it again fights
      // the platform and feels laggy rather than heavy.
      smoothWheel: true,
      syncTouch: false,
    });
    lenis = instance;

    // Drive Lenis from GSAP's ticker rather than its own RAF, so the scroll
    // position and every scrubbed tween are computed on the same frame. Two
    // independent loops put them a frame apart, which shows up as jitter.
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    instance.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(raf);
      instance.off("scroll", ScrollTrigger.update);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
}
