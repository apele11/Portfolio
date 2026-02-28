import NavBar from "../components/NavBar";

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
      <div style={{ display: "flex", flexDirection: "column", padding: "8rem 27rem", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "itc-benguiat-std-book, sans-serif", fontSize: "3rem", lineHeight: 1.1}}>This is a collection of works I have made to explore my interests and skills.</h1>
        <p style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: "1.25rem", opacity: 0.8 }}>
          three.js | glsl | JS | Shader | WebGl
        </p>
      </div>
    </div>
  );
}