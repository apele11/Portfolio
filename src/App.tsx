import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/page";

// Home is imported eagerly: it is the landing route, and splitting it would add
// a second network round trip in front of the content the user came for. Every
// other route is fetched on navigation.
const About = lazy(() => import("./about/page"));
const Playground = lazy(() => import("./playground/page"));
const ProjectPage = lazy(() => import("./projects/page"));

// The ternary — not a bare lazy() — is load-bearing. `import.meta.env.DEV` folds
// to `false` in a production build, making the dynamic import unreachable so the
// chunk is never emitted. A plain `lazy(() => import(...))` here would publish the
// admin panel, hardcoded password and all, as a fetchable file on the live site.
const Admin = import.meta.env.DEV ? lazy(() => import("./components/Admin")) : null;

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          {import.meta.env.DEV && Admin && (
            <Route path="/admin" element={<Admin onClose={() => window.history.back()} />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
