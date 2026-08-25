import NavBar from "../components/NavBar";
import HeroBackground from "../components/FragmentShader";
import { useSeo } from "../seo";
import "./About.css";

export default function AboutPage() {
  useSeo({
    title: "About — Emily Apel",
    description:
      "Emily Apel is a computer science student at the University of Florida working across design and code — public-sector projects, a co-founded nonprofit arts program, and creative technology.",
    path: "/about",
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <HeroBackground />
      <NavBar />

      {/* Content layer above background */}
      <div className="about-page">
        <div className="about-grid">
          <h1 className="about-name">Emily Apel</h1>
          <div className="about-tagline">Design, Code, Experience</div>

          <p className="about-body">
            Hi, my name is Emily Apel, and I am a rising senior Computer Science student at the University of Florida.
            I have contributed to public-sector projects, co-founded a nonprofit arts program, and led design initiatives for student organizations.
            Gaining experience in grant writing, community engagement, and creative technology.
            With skills in Python, C++, HTML, CSS, JS, and design tools, I approach problem-solving with both technical precision and creative perspective.
          </p>

          <div className="about-contact">
            <div className="about-contact-email">emilyapel@ufl.edu</div>
            <div className="about-contact-links">
              <a href="https://www.linkedin.com/in/emily-apel-900128293/" target="_blank" rel="noreferrer">
                linkedin
              </a>
              <span>|</span>
              <a href="https://github.com/apele11" target="_blank" rel="noreferrer">
                github
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
