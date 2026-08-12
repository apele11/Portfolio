import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Application } from "@splinetool/runtime";

/**
 * How much room a piece of media gets *inside a section body*, where the
 * default measure is the body column. Top-level media already spans the whole
 * page measure and needs none of this. Width is the hierarchy signal — a
 * process artefact and the shipped product should not occupy the same measure.
 *   inset  — reference material, kept small inside the text column
 *   column — the default
 *   wide   — breaks back across the label rail
 *   bleed  — past the measure, reserved for the strongest evidence
 */
export type MediaSize = "inset" | "column" | "wide" | "bleed";

const sizeClass = (size: MediaSize = "column") => (size === "column" ? "" : ` cs-${size}`);

/* ── Structure ─────────────────────────────────────────────── */

interface CaseStudySectionProps {
  /** Mono index in the label rail, e.g. "/01". */
  index?: string;
  /** Mono title in the label rail, e.g. "ABOUT". Set in bold beside the index. */
  label?: string;
  /** Serif section heading, at the top of the body column. */
  title?: string;
  children: ReactNode;
}

/**
 * A titled block on the label rail: the primary building unit of a case study.
 * The rail is a fixed width, so the body column starts at the same x whether
 * the label is one word or three.
 */
export function CaseStudySection({ index, label, title, children }: CaseStudySectionProps) {
  return (
    <section className="cs-section">
      <p className="cs-seclabel">
        {index ? <span className="cs-seclabel__n">{index}</span> : null}
        {label ? <span className="cs-seclabel__t">{label}</span> : null}
      </p>
      <div className="cs-body">
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}

/**
 * A right-aligned column wider than the body measure. Used where a passage
 * owns its media: giving up the label rail buys the figure the extra width,
 * and the indent still lines the text up with the sections above it.
 */
export function Band({ children }: { children: ReactNode }) {
  return (
    <div className="cs-band">
      {/* Carries .cs-body so a band's prose is set identically to a section's —
          only the measure and the alignment differ. */}
      <div className="cs-body cs-band__col">{children}</div>
    </div>
  );
}

/** A numbered walkthrough — the steps of a system, rather than a bullet list. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="cs-steps">{children}</ol>;
}

/* ── Media ─────────────────────────────────────────────────── */

interface FigureProps {
  src: string;
  alt: string;
  /** Caption below the media. */
  caption?: string;
  /** Small mono chip above the media (e.g. "Before"). */
  label?: string;
  /** How much width this gets. Only meaningful inside a section body. */
  size?: MediaSize;
}

/** A still image with an optional editorial caption. */
export function Figure({ src, alt, caption, label, size }: FigureProps) {
  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

interface ScrollFigureProps {
  src: string;
  alt: string;
  caption?: string;
  label?: string;
  /** Proportion of the window onto the image, as width / height. Defaults to the 952:535 the design uses. */
  ratio?: number;
  size?: MediaSize;
}

/**
 * A full-page screenshot shown through a fixed-height window it scrolls inside.
 * A stitched page capture is often several screens tall at full measure — this
 * keeps the whole thing available without letting one image swallow the case
 * study.
 */
export function ScrollFigure({ src, alt, caption, label, ratio, size }: ScrollFigureProps) {
  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}
      {/* The proportion goes through a custom property rather than an inline
          `aspect-ratio` so the stylesheet keeps its own default and can still
          cap the frame's height on a short viewport. */}
      <div
        className="cs-scrollframe"
        style={ratio ? ({ "--cs-frame-ratio": String(ratio) } as CSSProperties) : undefined}
        tabIndex={0}
        role="group"
        aria-label={`${alt} — scrollable`}
      >
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

interface VideoFigureProps {
  src: string;
  caption?: string;
  label?: string;
  poster?: string;
  size?: MediaSize;
  /** Whether to show a scrubbable progress bar along the bottom of the video. */
  showProgress?: boolean;
}

/**
 * A muted, looping demo video that plays only while on screen.
 */
export function VideoFigure({ src, caption, label, poster, size, showProgress }: VideoFigureProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const wasPlaying = useRef(false);
  const isIntersecting = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateProgress = () => {
      if (progressRef.current && el.duration && !isDragging.current) {
        progressRef.current.style.width = `${(el.currentTime / el.duration) * 100}%`;
      }
    };

    if (showProgress) {
      el.addEventListener("timeupdate", updateProgress);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (!isDragging.current) {
              void el.play().catch(() => {});
            }
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (showProgress) {
        el.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [showProgress]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!showProgress) return;
    const el = ref.current;
    const track = trackRef.current;
    if (!el || !track || !el.duration) return;

    isDragging.current = true;
    wasPlaying.current = !el.paused;
    el.pause();

    const updateSeek = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      let percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));
      el.currentTime = percentage * el.duration;
      if (progressRef.current) {
        progressRef.current.style.width = `${percentage * 100}%`;
      }
    };

    // Trigger initial seek to where they clicked
    updateSeek(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      updateSeek(ev.clientX);
    };

    const onPointerUp = () => {
      isDragging.current = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      
      if (wasPlaying.current && isIntersecting.current) {
        void el.play().catch(() => {});
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}
      <div className="cs-video-wrapper" style={{ position: "relative", display: "flex", width: "100%" }}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: "100%", display: "block" }}
        />
        {showProgress && (
          <div
            ref={trackRef}
            className="cs-video-scrubber"
            onPointerDown={handlePointerDown}
          >
            <div ref={progressRef} className="cs-video-progress" />
          </div>
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

interface SplineFigureProps {
  /** URL of the exported Spline scene (a .splinecode file). */
  scene: string;
  /** Still of the same scene: holds the frame until it is live, and stands in for it entirely under reduced motion. */
  poster: string;
  alt: string;
  caption?: string;
  label?: string;
  size?: MediaSize;
  /**
   * Y position to move the scene's camera to once it has loaded — a stopgap for
   * a published scene whose camera is framed off its own artwork, which shows up
   * as dead space in the frame. Prefer fixing the framing in Spline: this is a
   * magic number measured against one published version, and a re-publish that
   * moves the camera or the artwork silently invalidates it.
   */
  cameraY?: number;
}

/**
 * A live Spline scene, in place of a screenshot of one. The runtime is heavy
 * and pulls WASM from Spline's CDN, so it is loaded on two conditions: the
 * figure has been scrolled to, and the reader has not asked for reduced motion.
 * Until then — and if anything fails — the poster is what shows, which means
 * the figure is never broken, only sometimes static.
 */
export function SplineFigure({ scene, poster, alt, caption, label, size, cameraY }: SplineFigureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // A continuously animating 3D scene is precisely what this preference is
    // asking us not to start.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let app: Application | null = null;
    let cancelled = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();

        // Dynamic import so the runtime lands in its own chunk instead of the
        // main bundle — a reader who never reaches this figure never pays for it.
        void import("@splinetool/runtime")
          .then(async ({ Application: SplineApp }) => {
            if (cancelled) return;
            const instance = new SplineApp(canvas);
            // Re-publishing a Spline scene reuses the same URL, so a cached copy
            // would keep serving the old scene until the browser felt like
            // revalidating. `no-cache` forces a conditional request: a 304 when
            // the scene is unchanged, the new scene the moment it isn't.
            await instance.load(scene, undefined, { cache: "no-cache" });
            if (cancelled) {
              instance.dispose();
              return;
            }

            if (cameraY !== undefined) {
              // Named "Camera" in the scene — if it is ever renamed this misses
              // and the scene simply keeps its published framing.
              const camera = instance.findObjectByName("Camera");
              if (camera) {
                camera.position.y = cameraY;
              } else if (import.meta.env.DEV) {
                console.warn("[SplineFigure] no object named 'Camera' to reframe:", scene);
              }
            }

            app = instance;
            setReady(true);
          })
          .catch((error) => {
            // The poster stays, so the figure degrades instead of breaking. But
            // a silently static 3D scene is indistinguishable from a slow one,
            // so make the reason findable while developing.
            if (import.meta.env.DEV) {
              console.warn("[SplineFigure] scene failed to load:", scene, error);
            }
          });
      },
      { rootMargin: "200px" }
    );

    io.observe(canvas);
    return () => {
      cancelled = true;
      io.disconnect();
      app?.dispose();
    };
  }, [scene, cameraY]);

  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}
      <div className="cs-spline" data-ready={ready ? "true" : "false"}>
        <img src={poster} alt={alt} loading="lazy" />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * Figures across the measure, portrait cells so each one reads as an excerpt
 * lifted out of the page rather than a shrunken copy of it. `firstWide` gives
 * the first child double width — for a row where one piece of evidence (e.g.
 * a live 3D scene) outweighs the rest.
 */
export function MediaRow({ children, firstWide }: { children: ReactNode; firstWide?: boolean }) {
  return <div className={firstWide ? "cs-media-row cs-media-row--first-wide" : "cs-media-row"}>{children}</div>;
}

/**
 * Several figures held together as one piece of evidence. They sit closer to
 * each other than to the sections either side, so a page capture, the details
 * pulled out of it, and the tool behind it read as one exhibit.
 */
export function MediaGroup({ children }: { children: ReactNode }) {
  return <div className="cs-media-group">{children}</div>;
}

/** Side-by-side media, e.g. a before/after comparison. Stacks on mobile. */
export function MediaCompare({ children, size }: { children: ReactNode; size?: MediaSize }) {
  return <div className={`cs-compare${sizeClass(size)}`}>{children}</div>;
}

interface EmbedProps {
  src: string;
  title: string;
  /** Height as a % of width (aspect ratio). Defaults to 62.5 (16:10). */
  ratio?: number;
  caption?: string;
  /** Shown as an "open in new tab" link under the frame — also the fallback if the site refuses to embed. */
  href?: string;
  size?: MediaSize;
}

/** A live, interactive embed of an external site (e.g. the shipped product). */
export function Embed({ src, title, ratio = 62.5, caption, href, size }: EmbedProps) {
  return (
    <figure className={`cs-figure cs-embed${sizeClass(size)}`}>
      <div className="cs-embed-frame" style={{ paddingTop: `${ratio}%` }}>
        <iframe src={src} title={title} loading="lazy" allow="fullscreen" />
      </div>
      {(caption || href) && (
        <figcaption>
          {caption}
          {href && (
            <>
              {caption ? " " : null}
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open the live site ↗
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Paper diagrams ────────────────────────────────────────────
   A small vocabulary for drawing process artefacts — flows, pipelines,
   component systems — as hairline diagrams on a warm card. They are drawn
   rather than screenshotted so a reader can tell at a glance that they are a
   claim about how the work is organised, not a picture of the product. */

interface PaperDiagramProps {
  /** The diagram compressed to one line, inside the card. */
  summary?: string;
  /** Caption below the card, in the page's own voice. */
  caption?: string;
  /** Denser type, for diagrams carrying more boxes per row. */
  dense?: boolean;
  children: ReactNode;
}

export function PaperDiagram({ summary, caption, dense, children }: PaperDiagramProps) {
  return (
    <figure className="cs-figure">
      <div className={dense ? "cs-paper cs-paper--sm" : "cs-paper"}>
        {children}
        {summary ? <p className="cs-paper-foot">{summary}</p> : null}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * One line of the diagram. `phases` centres its groups instead of stretching
 * them, so a two-box phase beside a one-box phase keeps its natural height.
 */
export function PaperRow({ variant, children }: { variant?: "lanes" | "phases"; children: ReactNode }) {
  return <div className={variant === "phases" ? "cs-paper-row cs-paper-row--phases" : "cs-paper-row"}>{children}</div>;
}

/** A labelled, bordered region of the diagram: a lane, a phase, a shared base. */
export function PaperGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="cs-paper-group">
      <p className="cs-paper-label">{label}</p>
      {children}
    </div>
  );
}

interface PaperBoxProps {
  title: string;
  /** Tinted, to mark a box as something the system produced rather than part of it. */
  tint?: boolean;
  children?: ReactNode;
}

export function PaperBox({ title, tint, children }: PaperBoxProps) {
  return (
    <div className={tint ? "cs-paper-box cs-paper-box--tint" : "cs-paper-box"}>
      <h4>{title}</h4>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

/** A row of peer boxes — the shared components, or the shipped outputs. */
export function PaperGrid({ children }: { children: ReactNode }) {
  return <div className="cs-paper-grid">{children}</div>;
}

/** The step between two groups. `note` names what carries it across. */
export function PaperArrow({ note }: { note?: string }) {
  return (
    <div className={note ? "cs-paper-arrow cs-paper-arrow--wide" : "cs-paper-arrow"}>
      <p className="cs-paper-arrow__mark" aria-hidden="true">
        →
      </p>
      {note ? <p className="cs-paper-arrow__note">{note}</p> : null}
    </div>
  );
}

/** The turn from one stage of a stacked diagram to the next. */
export function PaperTurn() {
  return (
    <p className="cs-paper-turn" aria-hidden="true">
      ↓
    </p>
  );
}

/** A line of explanation between stages of a diagram. */
export function PaperNote({ center, children }: { center?: boolean; children: ReactNode }) {
  return <p className={center ? "cs-paper-foot cs-paper-foot--center" : "cs-paper-foot"}>{children}</p>;
}

/* ── Close ─────────────────────────────────────────────────── */

interface CtaLinkProps {
  href: string;
  children: ReactNode;
}

/** External call-to-action link (opens in a new tab). */
export function CtaLink({ href, children }: CtaLinkProps) {
  return (
    <a className="cs-cta" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}

interface OutcomeProps {
  /** Mono kicker, e.g. "Outcome". */
  label: string;
  /** What the work amounted to, in one sentence. */
  children: ReactNode;
  href?: string;
  cta?: string;
}

/** The close: what the work amounted to, then the way to go and see it. */
export function Outcome({ label, children, href, cta }: OutcomeProps) {
  return (
    <section className="cs-outcome">
      <p className="cs-outcome__label">{label}</p>
      <p className="cs-outcome__head">{children}</p>
      {href && cta ? <CtaLink href={href}>{cta}</CtaLink> : null}
    </section>
  );
}

/* ── Supporting primitives ─────────────────────────────────────
   Part of the kit but not used by every study. */

interface DecisionProps {
  title: string;
  /** Mono label above the title, e.g. "// Decision — the hero". */
  label?: string;
  children: ReactNode;
}

/** Highlighted callout for a key creative or technical decision. */
export function Decision({ title, label, children }: DecisionProps) {
  return (
    <div className="cs-decision">
      {label ? <p className="cs-decision-label">{label}</p> : null}
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/** Editorial pull-quote — the case study's "voice". */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="cs-quote">
      <p>{children}</p>
    </blockquote>
  );
}

interface LearningItemProps {
  title: string;
  children: ReactNode;
}

/** A single takeaway in a "Learnings" list. */
export function LearningItem({ title, children }: LearningItemProps) {
  return (
    <div className="cs-learn-item">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

interface ScopeBlockProps {
  /** What the author personally designed or built. */
  mine: string[];
  /** What someone else on the team delivered. Naming this makes `mine` credible. */
  others?: string[];
  /** One line on team size and how the work was split. */
  team?: string;
}

/**
 * Up-front answer to "on a group project, what was actually yours?" — the question
 * a reader is otherwise left to reconstruct from scattered sentences.
 */
export function ScopeBlock({ mine, others, team }: ScopeBlockProps) {
  return (
    <div className="cs-scope">
      {team ? <p className="cs-scope-team">{team}</p> : null}
      <div className="cs-scope-cols">
        <div>
          <p className="cs-scope-label">I designed &amp; built</p>
          <ul className="cs-scope-list">
            {mine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        {others && others.length > 0 ? (
          <div>
            <p className="cs-scope-label cs-scope-label-alt">Delivered by others</p>
            <ul className="cs-scope-list cs-scope-list-alt">
              {others.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface SystemMapProps {
  /** The shared components every output is assembled from. */
  base: string[];
  /** The props/config that differ per output: what varies, and where it comes from. */
  varies: { name: string; detail: string }[];
  /** Labels for the things the system produced, e.g. each case study. */
  outputs: string[];
  caption?: string;
  size?: MediaSize;
}

/**
 * Diagram of a component system: shared base → per-instance configuration →
 * outputs. The code-literal variant of the same argument PaperDiagram makes in
 * plain language — use this one when the component names are the point.
 */
export function SystemMap({ base, varies, outputs, caption, size }: SystemMapProps) {
  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      <div className="cs-sysmap">
        <div className="cs-sysmap-stage">
          <p className="cs-sysmap-label">Shared base</p>
          <ul className="cs-sysmap-base">
            {base.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>

        <div className="cs-sysmap-arrow" aria-hidden="true">
          →
        </div>

        <div className="cs-sysmap-stage">
          <p className="cs-sysmap-label">Configured per study</p>
          <dl className="cs-sysmap-varies">
            {varies.map((item) => (
              <div key={item.name}>
                <dt>{item.name}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="cs-sysmap-arrow" aria-hidden="true">
          →
        </div>

        <div className="cs-sysmap-stage">
          <p className="cs-sysmap-label">{outputs.length} shipped studies</p>
          <ul className="cs-sysmap-outputs">
            {outputs.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
