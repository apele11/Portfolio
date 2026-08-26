import { useState } from "react";
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

function LiveLink({ item }: { item: PlaygroundItem }) {
  // Omitted for sketches that only ever existed as a capture — there is nothing
  // to point at, and a dead link costs more than a missing one.
  if (!item.liveUrl) return null;
  return (
    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="playground-link">
      View Live Project
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
      </svg>
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

/**
 * Bare media on the page ground, with its title and tags held back until hover
 * or keyboard focus. The reference layout carries no tile captions at all, but
 * an unlabelled shader is just a coloured rectangle to anyone reading this as
 * work — so the label stays, it just does not compete with the image.
 */
function Tile({ item }: { item: PlaygroundItem }) {
  const body = (
    <>
      <Media item={item} />
      <figcaption className="playground-tile-caption">
        <span className="playground-tile-title">{item.title}</span>
        <Tags item={item} />
      </figcaption>
    </>
  );

  return (
    <figure
      className="playground-tile"
      style={{
        gridColumn: `span ${item.span ?? 1}`,
        aspectRatio: item.aspect ?? "1 / 1",
      }}
    >
      {item.liveUrl ? (
        <a
          href={item.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="playground-tile-link"
        >
          {body}
        </a>
      ) : (
        body
      )}
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        paddingTop: "7rem", // space for fixed navbar
      }}
    >
      <NavBar />
      
      {/* Intro Header */}
      <div style={{ display: "flex", flexDirection: "column", padding: "6rem 2rem 4rem 2rem", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "itc-benguiat-std-book, sans-serif", fontSize: "3rem", lineHeight: 1.1, maxWidth: "800px" }}>
          This is a collection of works I have made to explore my interests and skills.
        </h1>
        <p style={{ margin: "1rem 0 0 0", fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.25rem", opacity: 0.6, letterSpacing: "0.05em" }}>
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