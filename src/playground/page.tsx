import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { PLAYGROUND_ITEMS } from "../data/playground";
import type { PlaygroundItem } from "../data/playground";
import { useSeo } from "../seo";
import "./Playground.css";

/**
 * Live embed with its poster held over the top until the demo has booted.
 *
 * The swap is instant rather than a crossfade: the poster is a still of the same
 * scene, so cutting straight to the running version reads as the animation
 * starting, where a fade reads as a page defect.
 */
function EmbedFrame({ item }: { item: PlaygroundItem }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <iframe
        src={item.embedUrl}
        className="playground-iframe"
        title={item.title}
        scrolling="no"
        onLoad={() => setLoaded(true)}
      />
      {item.poster && !loaded && (
        <img src={item.poster} alt="" aria-hidden="true" className="playground-poster" />
      )}
    </>
  );
}

/** The media itself, shared by both layouts. */
function Media({ item }: { item: PlaygroundItem }) {
  if (item.type === "iframe" && item.embedUrl) return <EmbedFrame item={item} />;

  if (item.type === "video" && item.mediaUrl) {
    /*
     * Muted + playsInline are what let this autoplay at all: a clip with audio,
     * or one that wants fullscreen on iOS, is blocked by the browser and the
     * card shows a frozen frame instead.
     */
    return (
      <video
        src={item.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={item.title}
        className="playground-media"
      />
    );
  }

  return item.mediaUrl ? (
    <img src={item.mediaUrl} alt={item.title} className="playground-media" />
  ) : null;
}

function Tags({ item }: { item: PlaygroundItem }) {
  if (item.tags.length === 0) return null;
  return (
    <div className="playground-tags">
      {item.tags.map((tag) => (
        <span key={tag} className="playground-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Leaves-the-site arrow, shared by the feature link and the tile links. */
function ArrowOut() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}

function LiveLink({ item }: { item: PlaygroundItem }) {
  // Omitted for sketches that only ever existed as a capture — there is nothing
  // to point at, and a dead link costs more than a missing one.
  if (!item.liveUrl) return null;
  return (
    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="playground-link">
      View Live Project
      <ArrowOut />
    </a>
  );
}

/** The large card: media over a written caption. */
function FeatureCard({ item }: { item: PlaygroundItem }) {
  return (
    <article className="playground-card" style={{ gridColumn: `span ${item.span ?? 2}` }}>
      {/* Height is not set here: the wrapper flexes to whatever the tile block
          beside it is tall, which is what keeps the two columns level. */}
      <div className="playground-media-wrapper">
        <Media item={item} />
      </div>
      <div className="playground-caption">
        <h2 className="playground-title">{item.title}</h2>
        <p className="playground-description">{item.description}</p>
        <Tags item={item} />
        <LiveLink item={item} />
      </div>
    </article>
  );
}

/** Every outbound destination a sketch has, in one list. */
function SourceLinks({ item }: { item: PlaygroundItem }) {
  const sources = item.notes?.sources ?? [];
  if (!item.liveUrl && !item.credit && sources.length === 0) return null;

  return (
    <ul className="playground-dialog-sources">
      {item.liveUrl && (
        <li>
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="playground-link"
          >
            Open on Shadertoy
            <ArrowOut />
          </a>
        </li>
      )}
      {item.credit && (
        <li>
          <a
            href={item.credit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="playground-link playground-dialog-credit"
          >
            Written after {item.credit.label}
            <ArrowOut />
          </a>
        </li>
      )}
      {sources.map((source) => (
        <li key={source.url}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="playground-link"
          >
            {source.label}
            <ArrowOut />
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The notes behind one sketch.
 *
 * A native <dialog> driven by showModal(), rather than a hand-rolled overlay,
 * because that is what supplies Escape-to-close, the focus trap, inertness of
 * the page behind it, and focus returning to the tile on close. All of it is
 * behaviour that has to exist and none of it is behaviour worth writing again.
 */
function NotesDialog({
  item,
  open,
  onClose,
}: {
  item: PlaygroundItem;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // showModal() throws if the dialog is already open, and close() on a closed
    // dialog fires a second `close` event, so both are guarded on actual state.
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const notes = item.notes;

  return (
    <dialog
      ref={ref}
      className="playground-dialog"
      onClose={onClose}
      /*
       * Close on backdrop click, where "the backdrop" is the dialog element
       * itself: the panel fills it, so anything inside reports the panel as the
       * target instead.
       *
       * The press and the release both have to land there. Testing the click
       * alone closes the dialog the instant it opens — showModal() puts a
       * full-viewport backdrop under a cursor that is already mid-click, and
       * the release lands on it. Requiring the press as well means that stray
       * release has no matching press and is ignored, and it also stops a drag
       * that began on the text from closing the dialog when it ends outside.
       */
      onMouseDown={(event) => {
        pressedBackdrop.current = event.target === ref.current;
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && event.target === ref.current) onClose();
        pressedBackdrop.current = false;
      }}
    >
      <div className="playground-dialog-panel">
        <button
          type="button"
          className="playground-dialog-close"
          onClick={onClose}
          aria-label="Close notes"
        >
          ×
        </button>

        <div className="playground-dialog-media">
          {/* Remounted with the dialog, so the clip starts from the top rather
              than joining the tile's loop wherever it happens to be. */}
          {open && <Media item={item} />}
        </div>

        <div className="playground-dialog-body">
          <h2 className="playground-dialog-title">{item.title}</h2>
          <Tags item={item} />
          <p className="playground-dialog-description">{item.description}</p>

          {notes?.exploring && (
            <section className="playground-dialog-section">
              <h3>What I was exploring</h3>
              <p>{notes.exploring}</p>
            </section>
          )}

          {notes?.struggle && (
            <section className="playground-dialog-section">
              <h3>Where I got stuck</h3>
              <p>{notes.struggle}</p>
            </section>
          )}

          <SourceLinks item={item} />
        </div>
      </div>
    </dialog>
  );
}

/**
 * Bare media on the page ground, with its title and tags held back until hover
 * or keyboard focus. The reference layout carries no tile captions at all, but
 * an unlabelled shader is just a coloured rectangle to anyone reading this as
 * work — so the label stays, it just does not compete with the image.
 *
 * The tile is a button rather than a link out. A sketch has more than one
 * destination and more to say than a caption holds, so the click opens the
 * notes and every link lives in there. It also settles a markup problem: an
 * anchor cannot contain another anchor, and a tile wrapping two of them gets
 * torn apart by the parser rather than rendered.
 */
function Tile({ item }: { item: PlaygroundItem }) {
  const [open, setOpen] = useState(false);

  return (
    <figure
      className="playground-tile"
      style={{
        gridColumn: `span ${item.span ?? 1}`,
        aspectRatio: item.aspect ?? "1 / 1",
      }}
    >
      <button
        type="button"
        className="playground-tile-button"
        onClick={() => setOpen(true)}
        aria-label={`${item.title} — read the notes`}
      >
        <Media item={item} />
        {/*
          The only standing sign that a tile does something. It has to be
          permanent rather than revealed on hover: a touch device never hovers,
          so a hover-only affordance leaves half the visitors with nothing. It
          is small and cornered instead of a caption because the media is the
          content and anything laid across it is in the way.

          The title is not lost with the caption gone — it is on the button's
          aria-label, so a screen reader still announces which shader this is.
        */}
        <span className="playground-tile-affordance" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <NotesDialog item={item} open={open} onClose={() => setOpen(false)} />
    </figure>
  );
}

export default function PlaygroundPage() {
  useSeo({
    title: "Playground — Emily Apel",
    description:
      "Interactive WebGL and Three.js experiments by Emily Apel — shaders, generative graphics, and real-time rendering sketches, running live in the browser.",
    path: "/playground",
  });

  return (
    <div className="playground-page">
      <NavBar />

      {/* Intro Header */}
      <div className="playground-intro">
        <h1 className="playground-intro-title">
          This is a collection of works I have made to explore my interests and skills.
        </h1>
        <p className="playground-intro-subtitle">
          three.js | glsl | JS | Shader | WebGl
        </p>
      </div>

      {/* Editorial grid: one captioned feature, bare tiles around it */}
      <div className="playground-container">
        <div className="playground-grid">
          {PLAYGROUND_ITEMS.map((item) =>
            item.variant === "feature" ? (
              <FeatureCard key={item.id} item={item} />
            ) : (
              <Tile key={item.id} item={item} />
            )
          )}
        </div>
      </div>
    </div>
  );
}