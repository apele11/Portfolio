import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * How much room a piece of media gets. Width is the hierarchy signal — a process
 * artefact and the shipped product should not occupy the same measure.
 *   inset  — reference material, kept small inside the text column
 *   column — the default
 *   wide   — breaks out across the index rail
 *   bleed  — past the spine, reserved for the strongest evidence
 */
export type MediaSize = "inset" | "column" | "wide" | "bleed";

const sizeClass = (size: MediaSize = "column") => (size === "column" ? "" : ` cs-${size}`);

interface CaseStudySectionProps {
  /** Mono index in the spine rail, e.g. "01". Only use when sections are a real sequence. */
  index?: string;
  /** Optional short mono tag under the index. */
  label?: string;
  /** Serif section heading. */
  title?: string;
  /** Drop the accent tick (e.g. a closing list section that isn't a numbered step). */
  plain?: boolean;
  children: ReactNode;
}

/** A titled content block on the spine: the primary building unit of a case study. */
export function CaseStudySection({ index, label, title, plain, children }: CaseStudySectionProps) {
  return (
    <section className="cs-row">
      <div className="cs-idx">
        {index ? <span className="cs-n">{index}</span> : null}
        {label ? <span className="cs-lb">{label}</span> : null}
      </div>
      <div className={plain ? "cs-col cs-col-plain" : "cs-col"}>
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}

interface DecisionProps {
  title: string;
  /** Mono label above the title, e.g. "// Decision — the hero". */
  label?: string;
  children: ReactNode;
}

/** Highlighted "instrument" callout for a key creative/technical decision. */
export function Decision({ title, label, children }: DecisionProps) {
  return (
    <div className="cs-decision">
      {label ? <p className="cs-decision-label">{label}</p> : null}
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/** Editorial pull-quote — the case study's "voice", tuned to the project's --c4. */
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
 * Diagram of a component system: shared base → per-instance configuration → outputs.
 * Exists so "a universal component system unified all 8" is something a reader can
 * see rather than take on faith.
 */
export function SystemMap({ base, varies, outputs, caption, size = "wide" }: SystemMapProps) {
  return (
    <figure className={`cs-figure cs-sysmap-figure${sizeClass(size)}`}>
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

interface FigureProps {
  src: string;
  alt: string;
  /** Mono caption below the media. */
  caption?: string;
  /** Small mono chip above the media (e.g. "Before"). */
  label?: string;
  /** How much width this gets. Defaults to the text column. */
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
  /** Height of the window onto the image, in px. */
  height?: number;
  size?: MediaSize;
}

/**
 * A full-page screenshot shown through a fixed-height window it scrolls inside.
 * A stitched page capture is often several screens tall at full column width —
 * this keeps the whole thing available without letting one image swallow the
 * case study.
 */
export function ScrollFigure({ src, alt, caption, label, height = 620, size }: ScrollFigureProps) {
  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}
      {/* Height goes through a custom property rather than an inline `height` so
          the stylesheet can still cap it on short and narrow viewports. */}
      <div
        className="cs-scrollframe"
        style={{ "--cs-frame-h": `${height}px` } as CSSProperties}
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
  /** How much width this gets. Defaults to the text column. */
  size?: MediaSize;
}

/**
 * A muted, looping demo video that plays only while on screen — so heavy clips
 * download on scroll, not on page load. Falls back gracefully if autoplay is
 * blocked.
 */
export function VideoFigure({ src, caption, label, poster, size }: VideoFigureProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`cs-figure${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
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
  /** How much width this gets. Defaults to the text column. */
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
