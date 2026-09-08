import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  /** How far the image travels before settling, in px. */
  imageTravel?: number;
  /** How far the text block travels before settling, in px. */
  textTravel?: number;
  /** Extra distance the text lags behind the image on the way out. */
  textLag?: number;
  /** Seconds the animation takes to catch up to the scrollbar. Higher = more drag. */
  smoothing?: number;
  /**
   * Changes whenever the caller swaps to a different DOM tree (e.g. the mobile
   * and desktop arms of a layout). Without it the effect keeps the triggers it
   * built against the previous tree, which resizing past a breakpoint leaves
   * pointed at detached nodes.
   */
  layoutKey?: string | number;
}

export function useScrollAnimation(
  containerRef: React.RefObject<HTMLElement | null>,
  imageRef: React.RefObject<HTMLElement | null>,
  textRef: React.RefObject<HTMLElement | null>,
  options: ScrollAnimationOptions = {}
) {
  const {
    imageTravel = 140,
    textTravel = 90,
    textLag = 60,
    smoothing = 1.1,
    layoutKey = "",
  } = options;

  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const image = imageRef.current;
    // The whole metadata block is one target. Animating the eyebrow, title and
    // subtitle separately gave each its own offset, so they slid apart from one
    // another on the way past instead of holding together as a caption.
    const text = textRef.current;

    if (reduceMotion) {
      // No scroll-linked motion: just make sure everything is visible.
      if (image) gsap.set(image, { clearProps: "all" });
      if (text) gsap.set(text, { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      // --- Entry: scrubbed, so the motion is welded to the scrollbar and the
      // numeric `scrub` lets it trail behind by `smoothing` seconds. ---
      const enter = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top bottom-=10%",
          end: "center center",
          scrub: smoothing,
        },
      });

      if (image) {
        enter.fromTo(
          image,
          { opacity: 0, y: imageTravel, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 1 },
          0
        );
      }

      if (text) {
        enter.fromTo(
          text,
          { opacity: 0, y: textTravel },
          { opacity: 1, y: 0, ease: "power2.out", duration: 1 },
          0.12
        );
      }

      // --- Exit: the same elements drift on past the pin point, at different
      // rates, so scrolling back up reverses through the identical curve. ---
      const leave = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "center center",
          end: "bottom top",
          scrub: smoothing,
        },
      });

      if (image) {
        leave.to(
          image,
          { y: -imageTravel * 0.6, scale: 0.96, opacity: 0.15, ease: "none", duration: 1 },
          0
        );
      }

      if (text) {
        leave.to(
          text,
          {
            y: -(imageTravel * 0.6 + textLag),
            opacity: 0,
            ease: "none",
            duration: 1,
          },
          0
        );
      }

      timelinesRef.current = [enter, leave];
    }, container);

    return () => ctx.revert();
  }, [containerRef, imageRef, textRef, imageTravel, textTravel, textLag, smoothing, layoutKey]);
}
