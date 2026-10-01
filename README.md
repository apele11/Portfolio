# emilyapel.com

My portfolio, and the CMS I use to run it. **Live at [emilyapel.com](https://emilyapel.com).**

React 19 · TypeScript (strict) · Vite (Rolldown) · Three.js and GLSL · Firebase (Firestore, Auth, Hosting) · GitHub Actions

The site is a single-page app over a custom WebGL shader. Projects live in Firestore and are edited through an in-app CMS, so new work goes live without a code change or a redeploy. Each case study is its own layout, built from a shared kit of section, media and diagram components.

## Engineering decisions worth reading

Most of the work here is in details you only notice when they are wrong. These are the ones I'd point a reviewer to.

### One paint on load

- **The shader is a static import, on purpose.** Lazy-loading it left a window where the canvas was empty, and anything placed in that window (a flat color, a fade, a blank) read as a flash on refresh. With the shader present on React's first render, `first-paint` and `first-contentful-paint` land on the same millisecond.
- **Three.js gets its own chunk** (`manualChunks` in [`vite.config.ts`](vite.config.ts)), which Vite preloads with `<link rel="modulepreload">`. The library downloads in parallel with the entry chunk instead of queueing behind it, so the static import costs almost nothing in load time.
- **The project grid paints real content on the first frame.** [`scripts/snapshot-projects.mjs`](scripts/snapshot-projects.mjs) dumps Firestore into a typed snapshot at build time. The grid starts from that snapshot, and a live read then replaces it, so there is never a spinner that gets swapped for content.

### Rendering cost

- [`FragmentShader.tsx`](src/components/FragmentShader.tsx) caps the pixel ratio at 1.5 on touch devices and small screens, which shades about 44% fewer pixels than 2x for no visible change on a gradient this soft.
- Rendering stops when the canvas scrolls offscreen or the tab is hidden (`IntersectionObserver` and `visibilitychange`), and the animation respects `prefers-reduced-motion`.
- Three.js asks for a WebGL2 context and has no WebGL1 fallback, so a try/catch falls back to a CSS gradient built from the same color stops. A device without WebGL2 loses the motion, not the page.

### Bundle hygiene

- Every route except the landing page is `React.lazy`-loaded. The home page is imported eagerly, because splitting the route the user came for only adds a round trip.
- The admin panel is gated as `import.meta.env.DEV ? lazy(() => import(...)) : null`. A bare `lazy()` still emits its chunk in a production build. The ternary makes the import unreachable, so the CMS never ships to the live site at all.
- Type-only imports use `import type`. With `verbatimModuleSyntax`, a value import used only for types (such as `THREE.Color` in a uniform interface) is still emitted, and it would pull all of Three.js into that chunk.

### Untrusted data and security

- **Firestore is the CMS's real security boundary, not the login form.** The panel runs in the browser, so its UI can be bypassed, and the Firebase web config is public by design. [`firestore.rules`](firestore.rules) makes content world-readable and pins every write to one account's UID. A bare `request.auth != null` would not be enough: with email sign-in enabled, anyone holding the public API key can register an account.
- **Every Firestore read goes through a normalizer** ([`src/data/projects.ts`](src/data/projects.ts)) that type-guards each field and fills in defaults. Components never touch raw `doc.data()`.

### Case studies as a system

- Each study is composed from one kit in [`src/projects/case-study/`](src/projects/case-study): numbered sections, media groups, phone rows, scroll figures, and "paper" diagrams for drawing process. Each project's four Firestore colors become CSS custom properties, so every study inherits its own palette from the CMS.
- Layouts are resolved in one place, [`src/data/registry.ts`](src/data/registry.ts). A new study is one layout file and one registry entry.
- `PhoneShowcase` changes layout instead of restyling it. Above 900px it is a carousel beside the copy, and below that it shows every screen at once, because hiding screens behind a tap only pays off when there is room to spare.

### Discoverability

- Project cards are real `<Link>`s, not click handlers, so they work with a keyboard, a screen reader, cmd-click and crawlers. They are the only crawl path into the case studies.
- Each route sets its own title, description and canonical URL (`useSeo` in [`src/seo.ts`](src/seo.ts)). Without that, every case study would tell Google it duplicates the home page.
- The social preview card ([`scripts/generate-og-image.mjs`](scripts/generate-og-image.mjs)) is not a screenshot. It is the hero shader ported to the CPU and evaluated per pixel, with the blend done in linear light to match how Three.js treats the color uniforms.

## Tooling

| Command | What it does |
|---|---|
| `npm run dev` | Refreshes the Firestore snapshot, then starts Vite. The CMS is at `/admin`, or press Escape on the home page. It exists only in dev. |
| `npm run build` | Snapshot, then `tsc -b` as a strict typecheck gate, then `vite build`. |
| `npm run assets` | Compresses dropped media into `public/assets/compressed/`: WebP for images, H.264 for video via `ffmpeg-static`. Refuses to overwrite, and never re-encodes video that is already small enough. |
| `npm run capture -- <url> <Project>/<name>` | Takes a full-page screenshot of a running site through the local Chrome, for case-study figures. |
| `npm run og` | Re-renders the social preview card. |
| `npm run deploy` | Builds, then deploys hosting and the Firestore rules. |

Merges to `main` deploy through GitHub Actions, and pull requests get a preview channel.

## Running it locally

```bash
npm install
cp .env.example .env   # fill in a Firebase web config
npm run dev
```

Without credentials, the snapshot step warns and keeps the committed snapshot, so the site still builds and renders.

## Built with Claude Code

I build this site with Claude Code. [`CLAUDE.md`](CLAUDE.md) is the working memory for that. It records the architecture and every non-obvious decision above, and it also records the approaches that were tried and rejected, along with why. A lazy shader import, a flat-color placeholder and a fading curtain over the empty canvas were all tried and rejected, and each is written down so the same failed fix never comes back quietly. It is the best single document for how I think about this codebase.
