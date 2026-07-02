import NavBar from "../components/NavBar";
import { PLAYGROUND_ITEMS } from "../data/playground";
import "./Playground.css";

export default function PlaygroundPage() {
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

      {/* Masonry Gallery */}
      <div className="playground-container">
        <div className="playground-masonry">
          {PLAYGROUND_ITEMS.map((item) => (
            <div key={item.id} className="playground-card">
              
              {/* Media Wrapper */}
              <div 
                className="playground-media-wrapper"
                style={{ height: item.height || "350px" }}
              >
                {item.type === "iframe" && item.embedUrl ? (
                  <iframe
                    src={item.embedUrl}
                    className="playground-iframe"
                    title={item.title}
                    scrolling="no"
                    loading="lazy"
                  />
                ) : (
                  item.mediaUrl && (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )
                )}
              </div>

              {/* Caption details */}
              <div className="playground-caption">
                <h2 className="playground-title">{item.title}</h2>
                <p className="playground-description">{item.description}</p>
                
                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="playground-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="playground-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Link */}
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="playground-link"
                >
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
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}