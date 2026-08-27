import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
  /** Extra class on the outer <figure> — e.g. to condense the rhythm around a captionless figure. */
  className?: string;
}

/**
 * A muted, looping demo video that plays only while on screen.
 */
export function VideoFigure({ src, caption, label, poster, size, showProgress, className }: VideoFigureProps) {
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
    <figure className={`cs-figure${sizeClass(size)}${className ? ` ${className}` : ""}`}>
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

/**
 * Figures across the measure, portrait cells so each one reads as an excerpt
 * lifted out of the page rather than a shrunken copy of it. `firstWide` gives
 * the first child double width — for a row where one piece of evidence (e.g.
 * the hero clip) outweighs the rest.
 *
 * `square` swaps the portrait crop for a 1:1 one. Portrait is for excerpting a
 * page; a square cell is for a capture whose subject sits dead centre in a wide
 * frame — a 3D viewport, a canvas — where cropping to the middle discards
 * chrome rather than content, and three of them read as one gesture repeated
 * rather than three different screens.
 */
export function MediaRow({
  children,
  firstWide,
  square,
  className,
}: {
  children: ReactNode;
  firstWide?: boolean;
  square?: boolean;
  className?: string;
}) {
  const classes = [
    "cs-media-row",
    firstWide && "cs-media-row--first-wide",
    square && "cs-media-row--square",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}

/**
 * A row of phone-portrait captures, for a study whose product is an app rather
 * than a site. `MediaRow` crops its cells to landscape, which slices a phone
 * screen in half — these keep the phone's own ratio, and the column count is
 * what stops a 2:1-tall frame running off the page.
 */
export function PhoneRow({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode;
  /** Cells across the row. Three across the full measure is about 300px wide. */
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={`cs-phone-row${className ? ` ${className}` : ""}`}
      style={{ "--cs-phones": columns } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Several figures held together as one piece of evidence. They sit closer to
 * each other than to the sections either side, so a page capture, the details
 * pulled out of it, and the tool behind it read as one exhibit.
 */
export function MediaGroup({ children }: { children: ReactNode }) {
  return <div className="cs-media-group">{children}</div>;
}

export interface PhoneScreen {
  src: string;
  /** Short name for this screen, on the chip above the frame and the dot's label. */
  label: string;
  /** Caption under the frame while this screen is showing. */
  caption?: string;
  poster?: string;
}

/**
 * Puts a scrollable box in the middle of its content. On a phone the lightbox
 * slide is deliberately wider than the screen, and the default scroll position
 * is its top-left corner, which on a slide is usually a margin.
 */
function centreScroll(el: HTMLElement | null) {
  if (!el) return;
  el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
}

/** Live media-query match. Used to pick a layout, not just to skin one. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Below this the screens sit side by side; above it they share one frame. */
const SHOWCASE_SIDE_BY_SIDE = "(min-width: 900px)";

/**
 * A passage beside a phone, with the other screens a swipe away.
 *
 * The layout it replaces — a passage above a row of phones — fails on a large
 * screen for a reason worth recording: a 900x1920 capture at any readable
 * width is taller than the text it illustrates, so the prose has scrolled off
 * the top by the time the phone is in view. Stacking spends vertical space,
 * the scarce axis, to leave horizontal space empty, the abundant one. Turning
 * the pair sideways spends the right one, and the phone gets *bigger* rather
 * than smaller in the process.
 *
 * That trade only holds while there is width to spend. On a phone or a tablet
 * there is none, and the carousel would be pure cost — hiding half the
 * evidence behind a tap to save room that stacking was going to give away
 * anyway. So below `SHOWCASE_SIDE_BY_SIDE` this renders the plain row
 * instead: both screens visible at once, which at that size is the fastest
 * way to read the section.
 */
export function PhoneShowcase({ screens, children }: { screens: PhoneScreen[]; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const sideBySide = useMediaQuery(SHOWCASE_SIDE_BY_SIDE);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const onScreen = useRef(false);

  /* Every screen stays mounted so a swipe has nothing to fetch and a clip
     keeps its place in the loop — but only the one on show plays, and only
     while the frame is on screen. Several decoding video elements per section
     is not something to leave running behind a translate. */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const sync = () => {
      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        if (i === active && onScreen.current) void video.play().catch(() => {});
        else video.pause();
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreen.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.3 }
    );

    io.observe(frame);
    sync();
    return () => io.disconnect();
  }, [active, sideBySide]);

  /* Clamped, not wrapped. On a track, "next" is always a leftward move and
     "previous" always a rightward one — wrapping from the last screen back to
     the first would slide the opposite way to the arrow that asked for it. */
  const step = (delta: number) =>
    setActive((i) => Math.min(screens.length - 1, Math.max(0, i + delta)));

  if (!sideBySide) {
    return (
      <div className="cs-showcase cs-showcase--stacked">
        <div className="cs-body cs-showcase__text">{children}</div>
        <PhoneRow columns={screens.length >= 3 ? 3 : 2}>
          {screens.map((screen) => (
            <VideoFigure key={screen.src} src={screen.src} poster={screen.poster} caption={screen.caption} />
          ))}
        </PhoneRow>
      </div>
    );
  }

  const current = screens[active];

  return (
    <div className="cs-showcase">
      <div className="cs-body cs-showcase__text">{children}</div>

      <figure className="cs-showcase__figure">
        <p className="cs-media-label">{current.label}</p>

        <div
          className="cs-showcase__phone"
          ref={frameRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${screens.length} app screens`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
          }}
        >
          {/* One track carrying every screen, offset by the active index. The
              direction of travel falls out of the arithmetic, so a swipe always
              runs the way the arrow pointed without tracking it separately. */}
          <div className="cs-showcase__track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {screens.map((screen, i) => (
              <video
                key={screen.src}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="cs-showcase__screen"
                aria-hidden={i !== active}
                src={screen.src}
                poster={screen.poster}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ))}
          </div>
        </div>

        <div className="cs-showcase__controls">
          <button
            type="button"
            className="cs-showcase__arrow"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous screen"
          >
            <span aria-hidden="true">←</span>
          </button>
          {/* Dots rather than a bare pair of arrows: an arrow says you may move,
              the dots say how far there is to go and which one you are on. */}
          <div className="cs-showcase__dots">
            {screens.map((screen, i) => (
              <button
                key={screen.src}
                type="button"
                className="cs-showcase__dot"
                data-active={i === active}
                aria-label={screen.label}
                aria-current={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="cs-showcase__arrow"
            onClick={() => step(1)}
            disabled={active === screens.length - 1}
            aria-label="Next screen"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {current.caption ? <figcaption>{current.caption}</figcaption> : null}
      </figure>
    </div>
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
  size?: MediaSize;
  /**
   * A still to stand in for the embed until a reader asks for it, at which
   * point the frame is mounted and the embed starts loading.
   *
   * Worth setting whenever the embedded thing is heavy, and required in
   * practice for anything at the top of a page. A mounted iframe pays its whole
   * cost on load whether or not anybody wanted it, and "lead with the demo"
   * turns into a large download nobody asked for and a second WebGL context
   * running behind the hero. A poster keeps the demo first without that.
   */
  poster?: string;
  /** Alt text for the poster. Leave unset if the still adds nothing to the caption. */
  posterAlt?: string;
  /**
   * Whether to draw a play control over the poster. Defaults to true. Set it
   * false when the still already carries one, which a capture of a start screen
   * usually does: two play buttons in one frame, in two different styles, reads
   * as a bug rather than an invitation. The whole still is the control either
   * way, so nothing is lost by leaving it to the artwork.
   */
  posterPlay?: boolean;
}

/** A live, interactive embed of an external site (e.g. the shipped product). */
export function Embed({
  src,
  title,
  ratio = 62.5,
  caption,
  href,
  size,
  poster,
  posterAlt,
  posterPlay = true,
}: EmbedProps) {
  /* With no poster the frame is live from the start, which is the old
     behaviour and right for a light embed further down a page. */
  const [live, setLive] = useState(!poster);

  return (
    <figure className={`cs-figure cs-embed${sizeClass(size)}`}>
      <div className="cs-embed-frame" style={{ paddingTop: `${ratio}%` }}>
        {live ? (
          <iframe src={src} title={title} loading="lazy" allow="fullscreen" />
        ) : (
          /* The click that starts it is also the click that gives it focus,
             which a keyboard-driven demo needs anyway. */
          <button
            type="button"
            className="cs-embed__start"
            onClick={() => setLive(true)}
            aria-label={`Start ${title}`}
          >
            <img src={poster} alt={posterAlt ?? ""} />
            {posterPlay ? (
              <span className="cs-embed__play" aria-hidden="true">
                ▶
              </span>
            ) : null}
          </button>
        )}
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

/* ── Deck ──────────────────────────────────────────────────────
   A submitted presentation, flipped through in place. */

export interface DeckSlide {
  /** The carousel image, sized for the deck's own measure. */
  src: string;
  alt: string;
  /**
   * A higher-resolution copy for the full-size view, fetched only when a reader
   * opens that slide. The carousel and the lightbox want different files: the
   * carousel shows nine at roughly 950px and pays for all of them up front,
   * while the lightbox shows one at up to 2500px on a large display, or panned
   * past a phone screen at three times its device pixels. Sizing one image for
   * both means either the carousel is far heavier than it needs to be or the
   * full-size view is not full size. Falls back to `src` when unset.
   */
  full?: string;
  /**
   * How long this slide holds, in ms, overriding the deck's `interval`. A title
   * card is read the moment it lands and should not sit there for as long as a
   * slide carrying a paragraph, so the cadence is per slide rather than one
   * number chosen for the wordiest one.
   */
  hold?: number;
}

interface DeckSlidesProps {
  slides: DeckSlide[];
  caption?: string;
  /** Small mono chip above the frame. */
  label?: string;
  /** How long each slide holds before the deck moves on, in ms. */
  interval?: number;
  /**
   * How long the slide a reader landed on holds before the deck starts again,
   * in ms. Defaults to half again the interval, because reaching for the
   * controls means wanting a longer look at this one, and a hold shorter than
   * the interval would make the click read as having done nothing.
   */
  resumeDelay?: number;
  /** Slide proportion as width / height. Defaults to the 16:9 of a presentation. */
  ratio?: number;
  size?: MediaSize;
}

/**
 * A deck that plays itself: the slides advance on a timer, and touching the
 * controls holds them still for a moment before they start again.
 *
 * The point of the auto-advance is that a pitch deck is not a document here.
 * Nobody reads nine slides of somebody else's campaign strategy off a case
 * study, but plenty of people will let one play beside the prose. The controls
 * are for the reader who wants to stop on a slide, which is why the timer
 * yields to them rather than fighting them.
 *
 * The default interval is set for reading rather than for flipping. A slide
 * carrying a headline and a short passage wants several seconds even to skim,
 * and the cost of running fast is not that the deck looks hurried, it is that
 * the slides stop being legible at all and the whole thing turns into a
 * texture. The floor is what the wordiest slide needs, not the average.
 *
 * Three things follow from it moving on its own. It only runs while it is on
 * screen, so a deck further down the page is not animating against the hero
 * shader. It carries a real pause control, because content that updates itself
 * has to be stoppable by someone who cannot read at its pace. And it starts
 * paused under `prefers-reduced-motion`, which asks to be spared exactly this
 * kind of unprompted movement.
 */
export function DeckSlides({
  slides,
  caption,
  label,
  interval = 6000,
  resumeDelay = Math.round(interval * 1.5),
  ratio = 16 / 9,
  size,
}: DeckSlidesProps) {
  const count = slides.length;
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  /* The index runs 0..count, one past the last slide. That final position is a
     clone of the first, so closing the loop is a forward step like every other
     step; the index is then snapped back to 0 with the transition off, which is
     invisible because both positions show the same picture. The alternative is
     sliding back across every slide to reach the start, which is a long
     backwards sweep that no other step in the deck makes. */
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [playing, setPlaying] = useState(!reduced);
  const [onScreen, setOnScreen] = useState(false);
  /** When the deck is next allowed to move, pushed forward by an interaction. */
  const [heldUntil, setHeldUntil] = useState(0);
  /** Which slide is open full size, or null. The deck does not move while it is. */
  const [zoomed, setZoomed] = useState<number | null>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  const zoomBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /* One number for the CSS transition and the snap that follows it, kept under
     the hold so a slide has landed before the next one is asked for. */
  const slideMs = reduced ? 0 : Math.min(360, Math.round(interval * 0.7));
  /** The picture on screen. The snap below changes `index` without changing this. */
  const active = index % count;
  /** This slide's own turn, falling back to the deck's cadence. */
  const holdMs = slides[active]?.hold ?? interval;
  const isZoomed = zoomed !== null;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setOnScreen(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  /* One step is scheduled at a time rather than run off an interval, because
     the wait is not always the same length: after an interaction the slide the
     reader landed on owes them `resumeDelay` before anything moves.

     The dependency that makes this work is `active` rather than `index`. The
     two differ for exactly one moment, which is the snap back from the clone to
     the start, and that moment must not restart the clock — the picture on
     screen did not change, so the reader is owed the rest of its turn and not a
     fresh one. Keying on the visible slide means the pending step survives the
     snap and lands on time. */
  useEffect(() => {
    if (!playing || !onScreen || isZoomed || count < 2) return;
    const wait = Math.max(holdMs, heldUntil - Date.now());
    /* Sitting on the clone means the snap below has not run yet, which only
       happens in a throttled tab. Holding position lets it land and costs one
       step, where advancing from here would sweep the whole deck backwards. */
    const id = window.setTimeout(() => setIndex((i) => (i >= count ? i : i + 1)), wait);
    return () => window.clearTimeout(id);
  }, [playing, onScreen, isZoomed, count, holdMs, active, heldUntil]);

  useEffect(() => {
    if (index !== count) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, slideMs + 40);
    return () => window.clearTimeout(id);
  }, [index, count, slideMs]);

  useEffect(() => {
    if (animate) return;
    /* Two frames. The first paints the un-animated jump back to the start, the
       second turns the transition on again. Doing both inside one frame lets the
       browser coalesce them and animate the jump after all. */
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  /* Wraps, unlike PhoneShowcase's clamped track. That one is a set of screens
     with a first and a last; this one is a loop the reader has stepped into, so
     both ends have somewhere to go. */
  const goTo = (next: number) => {
    setIndex(((next % count) + count) % count);
    setHeldUntil(Date.now() + resumeDelay);
  };

  const step = (delta: number) => goTo(active + delta);

  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    /* Pressing play is a request to start moving, so it drops the hold that the
       button press would otherwise have to wait out. */
    if (next) setHeldUntil(0);
  };

  const stepZoom = (delta: number) =>
    setZoomed((z) => (z === null ? z : (((z + delta) % count) + count) % count));

  /* Closing puts the deck on whatever was being read rather than back where it
     was, and gives that slide the interaction hold, so the reader is not
     dropped straight back into a moving deck on a different slide. */
  const closeZoom = () => {
    if (zoomed !== null) {
      setIndex(zoomed);
      setHeldUntil(Date.now() + resumeDelay);
    }
    setZoomed(null);
    zoomBtnRef.current?.focus();
  };

  useEffect(() => {
    if (!isZoomed) return;
    const previous = document.body.style.overflow;
    /* The page behind must not scroll under the overlay. */
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isZoomed]);

  /* Keys are bound to the window rather than the dialog so they work wherever
     focus happens to be, and Tab is caught here because this is a modal: with
     the page behind it still in the tab order, focus would otherwise walk out
     of the overlay and into a deck the reader cannot see. */
  useEffect(() => {
    if (zoomed === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIndex(zoomed);
        setHeldUntil(Date.now() + resumeDelay);
        setZoomed(null);
        zoomBtnRef.current?.focus();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const delta = e.key === "ArrowLeft" ? -1 : 1;
        setZoomed((z) => (z === null ? z : (((z + delta) % count) + count) % count));
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      const stops = dialog?.querySelectorAll<HTMLElement>("button");
      if (!dialog || !stops || stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const here = document.activeElement;
      const outside = !dialog.contains(here);
      if (e.shiftKey && (here === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (here === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, count, resumeDelay]);

  /* On a phone the slide is wider than the screen on purpose (see the
     stylesheet), so it opens centred rather than at its top-left corner. This
     only lands for a slide the browser has already decoded; one that has not
     been painted yet still measures as fitting, so the image re-centres on its
     own load event too. */
  useEffect(() => {
    if (zoomed === null) return;
    centreScroll(stageRef.current);
    const id = requestAnimationFrame(() => centreScroll(stageRef.current));
    return () => cancelAnimationFrame(id);
  }, [zoomed]);

  return (
    <figure className={`cs-figure cs-deck${sizeClass(size)}`}>
      {label ? <p className="cs-media-label">{label}</p> : null}

      <div
        ref={frameRef}
        className="cs-deck__frame"
        style={
          {
            "--cs-deck-ratio": String(ratio),
            "--cs-deck-slide": `${slideMs}ms`,
          } as CSSProperties
        }
        role="group"
        aria-roledescription="carousel"
        aria-label={`${count} slides from the submitted deck`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          step(e.key === "ArrowLeft" ? -1 : 1);
        }}
      >
        <div
          className="cs-deck__track"
          data-animate={animate}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {[...slides, slides[0]].map((slide, i) => (
            <div className="cs-deck__slide" key={`${slide.src}-${i}`} aria-hidden={i !== active}>
              {/* Every slide is fetched up front. They sit up to eight measures
                  off to the side of the frame, far enough out that a lazy image
                  would not be asked for until the deck had already flipped past
                  it. Low priority is what keeps that off the hero's back. */}
              <img
                src={slide.src}
                alt={i === count ? "" : slide.alt}
                decoding="async"
                fetchPriority={i === 0 ? "auto" : "low"}
              />
            </div>
          ))}
        </div>

        {/* Its own control rather than a click handler on the frame, because the
            frame is the carousel and this is a second, different action on it.
            It covers the whole slide so the tap target is the picture, and
            carries a visible chip so that is discoverable rather than guessed. */}
        <button
          ref={zoomBtnRef}
          type="button"
          className="cs-deck__zoom"
          onClick={() => setZoomed(active)}
          aria-label={`View slide ${active + 1} of ${count} full size`}
        >
          <span className="cs-deck__zoomchip" aria-hidden="true">
            ⤢ Full size
          </span>
        </button>
      </div>

      <div className="cs-deck__controls">
        <button type="button" className="cs-deck__arrow" onClick={() => step(-1)} aria-label="Previous slide">
          <span aria-hidden="true">←</span>
        </button>

        <div className="cs-deck__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              className="cs-deck__dot"
              data-active={i === active}
              aria-label={`Slide ${i + 1} of ${count}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button type="button" className="cs-deck__arrow" onClick={() => step(1)} aria-label="Next slide">
          <span aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className="cs-deck__arrow cs-deck__play"
          onClick={togglePlay}
          aria-label={playing ? "Pause the deck" : "Play the deck"}
        >
          <span aria-hidden="true">{playing ? "❙❙" : "▶"}</span>
        </button>
      </div>

      {caption ? <figcaption>{caption}</figcaption> : null}

      {/* Portaled to <body>, so the overlay is not sized or clipped by the
          measure it was opened from, and so it cannot be trapped by a
          transformed ancestor. That puts it outside .case-study and out of
          reach of the page's custom properties, which is why its stylesheet
          names its own colours: it sits on black, not on the study's paper. */}
      {zoomed !== null
        ? createPortal(
            <div
              ref={dialogRef}
              className="cs-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Slide ${zoomed + 1} of ${count}, full size`}
              onClick={closeZoom}
            >
              <div className="cs-lightbox__stage" ref={stageRef} onClick={(e) => e.stopPropagation()}>
                {/* The carousel copy sits behind as a background while the
                    high-resolution one is still arriving, so a tap resolves to
                    a picture immediately and then sharpens, rather than to an
                    empty frame. It is already decoded: the deck fetched it. */}
                <img
                  className="cs-lightbox__img"
                  src={slides[zoomed].full ?? slides[zoomed].src}
                  alt={slides[zoomed].alt}
                  style={
                    slides[zoomed].full ? { backgroundImage: `url("${slides[zoomed].src}")` } : undefined
                  }
                  onLoad={() => centreScroll(stageRef.current)}
                />
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="cs-lightbox__close"
                onClick={closeZoom}
                aria-label="Close the full size view"
              >
                <span aria-hidden="true">✕</span>
              </button>

              <div className="cs-lightbox__bar" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="cs-lightbox__arrow"
                  onClick={() => stepZoom(-1)}
                  aria-label="Previous slide"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <p className="cs-lightbox__count">
                  {zoomed + 1} / {count}
                </p>
                <button
                  type="button"
                  className="cs-lightbox__arrow"
                  onClick={() => stepZoom(1)}
                  aria-label="Next slide"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
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
