import { useCallback, useRef, type CSSProperties } from "react";
import { isVideoUrl } from "../data/media";

interface CoverMediaProps {
  /** A still or a clip — whichever the CMS has on the project's coverUrl. */
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Load at full priority. Use for the one cover that sits in the fold. */
  eager?: boolean;
}

/**
 * Renders a project cover as an image or a muted looping video, decided by the
 * URL. Video covers play only while on screen — the home page stacks one cover
 * per project, and without that every clip would download and loop at once.
 * Under prefers-reduced-motion they hold their first frame.
 */
export default function CoverMedia({ src, alt, className, style, eager }: CoverMediaProps) {
  const observer = useRef<IntersectionObserver | null>(null);

  /**
   * A callback ref rather than useRef + useEffect: the <video> is swapped out
   * whenever `src` flips between an image and a clip (project data arrives
   * async, so the first render is often an empty src). An effect keyed on `src`
   * can end up observing the node that was just replaced, leaving the real one
   * unwatched and permanently paused.
   */
  const attach = useCallback((el: HTMLVideoElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reduced.matches) {
            // Rejections here are autoplay refusals or a superseded play() —
            // either way the frame stays put, which is an acceptable cover.
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    observer.current.observe(el);
  }, []);

  if (!isVideoUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={eager ? "eager" : "lazy"}
      />
    );
  }

  return (
    <video
      ref={attach}
      src={src}
      aria-label={alt}
      className={className}
      style={style}
      // The fold shouldn't wait on an observer callback to start.
      autoPlay={eager}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "metadata"}
    />
  );
}
