import NavBar from "../components/NavBar";
import HeroBackground from "../components/FragmentShader";

export default function AboutPage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HeroBackground />
      <NavBar />

      {/* Content layer above background */}
      <div style={page}>
        {/* Top row: left title block + right paragraph */}
        <div style={topRow}>
          <div style={leftCol}>
            <h1 style={name}>Emily Apel</h1>
            <div style={tagline}>Design, Code, Experience</div>
          </div>

          <div style={rightCol}>
            <p style={body}>
              Hi, my name is Emily Apel, and I am a rising senior Computer Science student at the University of Florida.
              I have contributed to public-sector projects, co-founded a nonprofit arts program, and led design initiatives for student organizations.
              Gaining experience in grant writing, community engagement, and creative technology.
              With skills in Python, C++, HTML, CSS, JS, and design tools, I approach problem-solving with both technical precision and creative perspective.
            </p>
          </div>
        </div>

        {/* Bottom row: contact */}
        <div style={bottomRow}>
          <div style={contactBlock}>
            <div style={contactLine}>emilyapel@ufl.edu</div>
            <div style={contactLinks}>
              <a style={contactLink} href="https://www.linkedin.com/in/emily-apel-900128293/" target="_blank" rel="noreferrer">
                linkedin
              </a>
              <span style={divider}>|</span>
              <a style={contactLink} href="https://github.com/apele11" target="_blank" rel="noreferrer">
                github
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  paddingTop: "8rem", // leave room for fixed navbar
  paddingLeft: "clamp(40px, 6vw, 120px)",
  paddingRight: "clamp(40px, 6vw, 120px)",
  color: "#fff",
};

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "clamp(32px, 6vw, 96px)",
  maxWidth: "1200px",
};

const leftCol: React.CSSProperties = {
  flex: "0 0 auto",
  minWidth: "260px",
};

const rightCol: React.CSSProperties = {
  flex: "1 1 520px",
  maxWidth: "640px",
};

const name: React.CSSProperties = {
  fontFamily: "itc-benguiat-std-book, serif",
  fontSize: "clamp(44px, 5vw, 72px)",
  fontWeight: 400,
  margin: 0,
  lineHeight: 1.05,
};

const tagline: React.CSSProperties = {
  marginTop: "1.75rem",
  fontStyle: "italic",
  opacity: 0.85,
};

const body: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.7,
  fontSize: "16px",
  opacity: 0.9,
};

const bottomRow: React.CSSProperties = {
  marginTop: "clamp(48px, 10vh, 120px)",
  maxWidth: "1200px",
};

const contactBlock: React.CSSProperties = {
  opacity: 0.85,
};

const contactLine: React.CSSProperties = {
  marginBottom: "0.5rem",
};

const contactLinks: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

const contactLink: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
};

const divider: React.CSSProperties = {
  opacity: 0.6,
};