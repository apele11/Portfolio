import { Suspense, lazy } from "react";
import type { ComponentType } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/page";
import { useSmoothScroll } from "./smoothScroll";

const CHUNK_RELOAD_KEY = "chunk-reload-at";

/**
 * lazy(), except a route chunk that fails to load reloads the page once.
 *
 * Every deploy deletes the previous build's chunks. A tab still running that
 * build (open since before the deploy) asks for a file that no longer exists,
 * and the catch-all rewrite in firebase.json answers with index.html, which
 * the browser rejects as a module. Left alone, the route never renders and
 * the whole app unmounts until the visitor thinks to refresh. Reloading
 * fetches the current index.html, whose chunk names exist.
 *
 * The timestamp stops a reload loop. If the reload did not bring the chunk in
 * either (offline, or a genuinely broken deploy), the error is thrown instead,
 * and so it is when sessionStorage is unavailable to hold the timestamp.
 */
function lazyRoute<T extends ComponentType>(load: () => Promise<{ default: T }>) {
  return lazy(() =>
    load().catch((error: unknown) => {
      try {
        const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY)) || 0;
        if (Date.now() - last < 10_000) throw error;
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
      } catch {
        throw error;
      }
      window.location.reload();
      return new Promise<never>(() => {});
    })
  );
}

// Home is imported eagerly: it is the landing route, and splitting it would add
// a second network round trip in front of the content the user came for. Every
// other route is fetched on navigation.
const About = lazyRoute(() => import("./about/page"));
const Playground = lazyRoute(() => import("./playground/page"));
const ProjectPage = lazyRoute(() => import("./projects/page"));

// The ternary — not a bare lazy() — is load-bearing. `import.meta.env.DEV` folds
// to `false` in a production build, making the dynamic import unreachable so the
// chunk is never emitted. A plain `lazy(() => import(...))` here would publish the
// admin panel, hardcoded password and all, as a fetchable file on the live site.
const Admin = import.meta.env.DEV ? lazy(() => import("./components/Admin")) : null;

export default function App() {
  useSmoothScroll();

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
