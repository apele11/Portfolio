# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # snapshot (via predev), then Vite dev server (/admin lives here; see below)
npm run build     # tsc -b (typecheck) then vite build → dist/
npm run lint      # eslint over the repo
npm run preview   # serve the production build locally
npm run deploy    # build + firebase deploy (Firebase Hosting, project portfolio-cf811)
npm run assets    # compress dropped media into public/assets/compressed/ (see below)
npm run capture   # screenshot a running site into the asset drop zone (see below)
npm run snapshot  # regenerate src/data/projects.snapshot.ts from Firestore (see below)
npm run og        # re-render public/og-image.jpg, the social preview card (see below)
```

There is no test runner configured. `npm run build` runs the TypeScript project build (`tsc -b`) as a strict typecheck gate before Vite bundles, so a green build means types pass.

The bundler is `rolldown-vite` (Rolldown-based Vite), pinned via a `package.json` override aliasing `vite` → `npm:rolldown-vite`. Treat it as Vite.

## Architecture

Single-page React 19 + TypeScript portfolio site. Content (projects) lives in **Firestore**, not in the repo; the code is the presentation layer plus an in-app CMS.

### Routing (`src/App.tsx`)
`react-router-dom` v7 `BrowserRouter`. Routes: `/` (home), `/about`, `/playground`, `/projects/:projectId`. The `/admin` route is **only mounted when `import.meta.env.DEV`** — it does not exist in production builds. Firebase Hosting rewrites all paths to `/index.html` (`firebase.json`), so client routing works on deep links.

Every route except `/` is `React.lazy`-loaded behind a single `<Suspense>`. **Home is deliberately imported eagerly** — it is the landing route, and splitting it would put a second network round trip in front of the content the user came for. Keep it that way.

`Admin` is gated as `import.meta.env.DEV ? lazy(() => import(...)) : null`, and the ternary is load-bearing: a bare `lazy(() => import(...))` still emits the chunk in a production build, publishing the whole CMS as a fetchable file on the live site. (It once also carried a hardcoded password; sign-in is now Firebase Auth, but the old literal is still in git history, so nothing should ever reuse it.) The `false` branch makes the dynamic import unreachable so nothing is emitted. Verify with `ls dist/assets | grep -i admin` after building — it must come back empty.

Page components follow a `src/<route>/page.tsx` convention (`home/`, `about/`, `playground/`, `projects/`).

### Data layer (Firestore)
- `src/firebase.ts` initializes the app from `VITE_FIREBASE_*` env vars (see `.env`) and exports `db`. Firebase Analytics is dynamically imported from an idle callback in prod only — keep it off the critical path.
- Projects are documents in the `projects` collection. `src/types/project.ts` defines `ProjectDetail` (full doc) and `Project` (list-card subset).
- **All Firestore reads go through the normalizer.** `normalizeProjectDetail()` in `src/data/projects.ts` coerces every field with type guards and fills defaults (including `DEFAULT_COLORS`). Do not consume raw `doc.data()` for a full project — untrusted CMS data must pass through this. `fetchProjectById()` is the single-doc read.
- **Project cards are `<Link>`s, not click handlers.** `ProjectsFrontend` wraps
each panel in an anchor filling the section. It was a `<div onClick>`, which is
invisible to a crawler, unreachable by keyboard, silent to a screen reader, and
cannot be cmd-clicked. It is also the *only* crawl path into the case studies —
nothing else on the site links to them, and Googlebot follows hrefs rather than
clicking. Do not revert it to a handler.

The home page project grid (`src/components/Projects.tsx`) is seeded from a build-time snapshot (below), then corrected by a live read: `onSnapshot` in dev so admin edits appear live, a one-shot `getDocs` in prod. The admin panel and single-project page use one-shot `getDoc`/`getDocs`. Projects are always sorted by the numeric `order` field.

### Build-time project snapshot (`scripts/snapshot-projects.mjs`)
`npm run snapshot` dumps the `projects`
collection to two generated, committed files: `src/data/projects.snapshot.ts`
(the card subset) and `public/sitemap.xml`. The sitemap is generated from the
same read rather than hand-maintained because project URLs are Firestore
document ids — nobody keeps a hand-written list of timestamps in step with a
CMS. It carries no `<lastmod>`, so its content is stable and it does not rewrite
itself on every build. `Projects.tsx` uses it as its initial state so the grid paints
real content on the first frame instead of a spinner while Firestore connects.

It runs as the first step of `npm run build`, and again from a `predev` hook
before `npm run dev` — so both the grid and the sitemap are current in dev
without anyone remembering to regenerate them. That hook is why starting the dev
server can put the snapshot in your working tree: it is a real read against live
Firestore, so anything edited in the admin panel since the last build shows up as
a diff. That is the snapshot doing its job, not churn — see the write guard
below for what it refuses to rewrite.

Firestore remains the source of truth and overwrites the snapshot as soon as the
live read lands, so a stale snapshot self-corrects within about a second; it only
matters for the first paint. Content edited in the admin panel without a redeploy
stays stale in the snapshot until the next build.

The script fails soft: if Firestore is unreachable it warns, keeps the committed
snapshot, and lets the build continue. Never hand-edit the generated file.

**It is generated but it must stay committed — do not gitignore it.** The
committed copy is the only real content the grid has before Firestore answers,
and the `predev`/prebuild hooks cannot be relied on to recreate it: `.env` is not
committed, so on a fresh clone the generate step has no credentials, `bail()`
fires, and with nothing to keep it writes an *empty* snapshot and exits 0. That
ships a blank first paint rather than failing the build — which is the right
call for a build, and exactly why the populated file needs to be in git rather
than regenerated on demand.

The script rewrites a file only when its content actually changes, and there is
nothing per-run in either body to defeat that — the snapshot used to export a
`SNAPSHOT_GENERATED_AT` stamp that nothing imported and that dragged a fresh
timestamp into the diff on any run that touched the file; it has been removed,
and `git log` answers the same question accurately. The comparison normalises
line endings first, because `.gitattributes` (`* text=auto`) plus core.autocrlf
puts CRLF in the Windows working copy while the script assembles LF — matching
them raw made the guard miss every time and put the file in the diff after every
build. Net effect: repeated runs are true no-ops, so `npm run dev` leaves the
tree clean unless the CMS genuinely changed.

### Admin / CMS (`src/components/Admin.tsx`)
In-app editor for the `projects` collection: create, edit, delete, and reorder (swaps `order` values) documents via `setDoc`/`deleteDoc`. Dev-only — reach it by pressing **Escape** on the home page, or navigating to `/admin`.

Sign-in is Firebase Auth (Email/Password) via `src/auth.ts`. The session persists across reloads, and the header prints the signed-in UID because `firestore.rules` pins write access to it.

**The login form is not the security boundary — `firestore.rules` is.** The panel runs in the browser, so its UI can be bypassed; anyone can talk to Firestore directly using the web config, which is public by design and ships in the production bundle anyway. What actually stops a stranger writing to the collection is the rules file.

### Firestore security rules (`firestore.rules`)
Registered in `firebase.json`, so `npm run deploy` now deploys rules alongside hosting. Deploy alone with `firebase deploy --only firestore:rules`. (CI is unaffected — the GitHub Actions workflows use `action-hosting-deploy`, which only touches hosting.)

Content is world-readable and writable only by one pinned UID. **Do not loosen `isOwner()` to a bare `request.auth != null`.** The Firebase web API key is public, and with Email/Password sign-in enabled anyone holding it can self-register through `createUserWithEmailAndPassword`; such an account satisfies `request.auth != null`, which would leave the collection effectively world-writable.

### Project detail rendering — layout resolution
A project doc renders through a swappable layout component, resolved in **one**
place: `resolveProjectLayout()` in `src/data/registry.ts`. `src/projects/page.tsx`
calls it and renders the result — it does no matching of its own.

The registry is an ordered list of `{ matches, component }` entries; the first
match wins, and anything unmatched falls back to `DefaultProjectHero` (the
generic, metadata-only hero). Entries match on a **keyword in the project
`header`**, not on the document id — Firestore ids are generated timestamps and
tell you nothing about which project they are.

To add a case study: build its layout in `src/projects/layouts/` by composing
the primitives in `src/projects/case-study/`, then add one entry to
`layoutRegistry`. Layouts receive `{ project, onBack }` (`ProjectLayoutProps`).

### Case-study primitives (`src/projects/case-study/`)
`LockedInProjectLayout`, `NewBusinessLayout`, and `Libre3DLayout` are all
assembled from one shared kit, and a new study should be too — a bespoke
per-project stylesheet is how the studies drifted apart in the first place.

- `CaseStudyLayout` is the shell: the shader hero, then the "Editorial ×
  Instrument" spine. The project's `color1`–`color4` become CSS custom
  properties, so a study inherits its palette from Firestore rather than
  hardcoding one. `tone="cool"` re-derives the paper diagrams for a navy/cyan
  palette; the default warm system suits warm or violet projects.
- Structure: `CaseStudySection` (numbered, on the label rail), `Band` (a wider
  right-aligned column for a passage that owns its media), `Steps`.
- Media: `Figure`, `VideoFigure`, `ScrollFigure`, `Embed`, and the grouping
  wrappers `MediaGroup`, `MediaRow`, `MediaCompare`, `PhoneRow`.
- `PhoneShowcase` is the app-feature block: a passage beside one phone, with
  the other screens on a sliding track behind arrow and dot controls. It
  **changes layout rather than skinning one** — above 900px it is the
  side-by-side carousel, below it renders a plain `PhoneRow` with every screen
  visible at once. The breakpoint is read in JS (`useMediaQuery`), so the two
  arms are different trees, not one tree reflowed; that is deliberate, because
  hiding half the evidence behind a tap only pays for itself when there is
  horizontal space to buy with it.
- `PaperDiagram` and its vocabulary (`PaperRow`, `PaperGroup`, `PaperBox`,
  `PaperGrid`, `PaperArrow`, `PaperTurn`, `PaperNote`) draw process artefacts —
  flows, pipelines, component systems — as hairline diagrams on a warm card,
  deliberately drawn rather than screenshotted so they read as a claim about
  how the work was organised, not a picture of the product.
- `Outcome` closes the study.

**`MediaRow` crops its cells to landscape; `PhoneRow` does not.** A study whose
product is an app has portrait captures (the LockedIn media is 900×1920), and
putting those through `MediaRow` slices the screen in half. `PhoneRow` holds
the phone's own ratio and takes a `columns` count; on narrow viewports it caps
at two columns, because four across a phone screen is a 74px sliver.

Steps take any mix of inline and block content — the number hangs in an
absolutely-positioned `::before`. Do not restore `display: grid` on
`.cs-steps li`: each anonymous run of text in a grid container is its own grid
item, so `<strong>Label</strong> — the rest` puts the prose in the number
column, one word per line.

### Media assets (`scripts/compress-assets.mjs`)

Raw media is **never committed**. `public/assets/` is a gitignored drop zone; only
`public/assets/compressed/` is tracked and deployed:

```
public/assets/<Project>/…            drop raw files here (nest freely) — gitignored
public/assets/compressed/<Project>/  web-ready output — committed + deployed
```

`npm run assets` compresses everything in the drop zone into
`compressed/<Project>/`, then deletes the originals it consumed. The project
folder is preserved; nesting below it is flattened. Images → WebP (1800px, q86),
video → H.264 MP4 (1440px, CRF 24, audio stripped, `+faststart`). Video already
under 2600 kbps and within 1440px is moved rather than re-encoded, so repeat runs
never degrade anything. Uses `ffmpeg-static`; no system ffmpeg needed.

The script refuses to overwrite: it resolves every destination before writing,
hard-errors on a name clash within a project or a file dropped outside a project
folder, and skips names already present in `compressed/` (keeping the original)
unless `--force`. Other flags: `--dry`, `--keep`, `--only=<substring>`.

Reference assets as `/assets/compressed/<Project>/<file>`. Layouts define a local
`const ASSETS = "/assets/compressed/<Project>"`.

### Case-study screenshots (`scripts/capture-page.mjs`)

`npm run capture -- <url> <Project>/<name>` writes a full-page still of a running
site to `public/assets/<Project>/<name>.png` — the drop zone — so producing a
case-study figure is two commands:

```bash
npm run capture -- http://localhost:3000 PinkAhead/PinkAhead-Landing-Full
npm run assets
```

It drives the Chrome already installed on the machine through `puppeteer-core`
(a devDependency; it downloads no browser of its own). Set `CHROME_PATH` if
Chrome is somewhere unusual. Flags: `--width= --height= --scale= --mobile
--viewport --wait= --raw`.

**The viewport is deliberately a normal 1440x900 rather than the height of the
page.** Source pages routinely build sections on `min-height: 100dvh`, and a
page-tall window makes the first section swell to fill it while everything below
falls off the bottom of the capture. This bit the Jukebox landing page, whose
Hero, Features and Repos are all `calc(100dvh - header)`. The script scrolls the
page through once instead — which is also what makes lazy images load — and then
takes the full height with `captureBeyondViewport`.

The wait for fonts and in-flight images is **bounded on purpose**. A lazy image
below the fold never begins loading until something scrolls to it, so its
`complete` stays false and neither `load` nor `error` ever fires; waiting on all
of them outright deadlocks under `--viewport`, which skips the scroll pass.

By default it hides dev-server furniture (the Next.js badge, the Vite error
overlay) and pauses animations so a still never lands mid-transition. `--raw`
turns that off.

A tall result belongs in `ScrollFigure`, not `Figure` — the script says so when
the capture comes out tall.

### Metadata and the social card (`scripts/generate-og-image.mjs`)

`index.html` carries the title, description, canonical, Open Graph / Twitter
tags, and a `Person` JSON-LD block. **Every URL in those tags is absolute.**
Link scrapers fetch the tags out of context and do not resolve relative paths,
so a bare `/og-image.jpg` is the usual reason a preview comes back blank. The
absolute host is hardcoded to `https://emilyapel.com`, the custom domain. The
Firebase default (`portfolio-cf811.web.app`) still serves the same content, so
the canonical tag is what stops the two hosts competing as duplicates — it must
keep pointing at the custom domain. If the domain ever changes again, these
strings and `public/sitemap.xml` and `public/robots.txt` all move with it.

`npm run og` regenerates `public/og-image.jpg` (1200×630). The background is
**not a screenshot** — it is the hero shader ported to CPU in the script and
evaluated per pixel, so the card and the live page share one definition of the
gradient. The port mirrors the GLSL closely enough that it has to be kept in
step by hand: the palette, the warp constants, the contrast ramp, and the four
colour stops are duplicated. Change the shader, re-run the script.

Two details in the port are load-bearing. The warp's two vector adds must read
the pre-update vector — unrolling them into sequential scalar updates quietly
changes the image. And the blend happens in **linear** light, because Three
sets `outputColorSpace = SRGBColorSpace` and linearises `uColor1`–`uColor4` on
the way in; blending the hex values directly gives visibly muddier midtones.

Text is composited by ffmpeg's `drawtext` (`ffmpeg-static` ships libfreetype),
so there is no headless browser or native canvas in the toolchain. `drawtext`
has no tracking control, so the wordmark's letterspacing is baked into the
string. Strings are passed as `textfile=` rather than filter arguments, which
keeps ffmpeg's escaping rules and Windows drive colons out of the picture.
`scripts/assets/SpaceGrotesk-Regular.ttf` is committed so the render is
reproducible offline; the app itself still loads Space Grotesk from Google.

**Per-route tags come from `src/seo.ts`, and only reach crawlers that run JS.**
Firebase rewrites every path to `index.html`, so the served HTML always carries
the home page's tags. `useSeo({ title, description, path })` rewrites them on
mount; every route calls it, which is what makes it safe — nothing needs to
restore the previous route's values on the way out.

The canonical is the load-bearing one. `rel="canonical"` is a directive, so
leaving every case study pointing at `/` tells Google those URLs are duplicates
of the home page and should not be indexed separately. Any new route **must**
call `useSeo`, or it inherits that instruction.

This reaches Googlebot, which renders. It does **not** reach LinkedIn, Slack, X
or any other scraper that reads raw HTML — those still see the home card for
every URL, and no amount of client-side tag rewriting changes that. Only
prerendering does.

The head lives in the **root** `index.html` and nowhere else. A stale
`public/index.html` from an old Vite build used to sit alongside it; it has been
deleted and `.gitignore` now blocks the path, because Vite copies `public/` into
`dist/` before writing the real `index.html` over it — so a file there is always
either dead or actively shadowing the entry point.

### Shader background (`src/components/FragmentShader.tsx`)
**`FragmentShader` must stay a static import — do not `React.lazy` it.** The shader has to exist on React's first render, otherwise there is a window where the canvas has nothing in it, and *anything* put in that window (flat colour placeholder, fading curtain, blank) reads as a flash on refresh. Two earlier attempts at covering that gap were both rejected on those grounds. Keeping the import static means the page has one paint: `first-paint` and `first-contentful-paint` land on the same millisecond.

The cost is paid back by `manualChunks` in `vite.config.ts`, which isolates `node_modules/three` into its own `three` chunk. Vite emits a `<link rel="modulepreload">` for it, so it downloads *in parallel* with the entry chunk rather than queueing behind it — verify with `grep modulepreload dist/index.html` after building. Both start together; execution waits for both. Route-level `React.lazy` (see Routing) is unaffected and still applies.

`HeroBackground` renders a full-viewport animated WebGL background with Three.js and a custom GLSL fragment shader. Its `uColor1`–`uColor4` uniforms are exposed via a `uniformsRef` shared with `Hero` and `Projects`, so hovering project cards can drive the background colors (each project doc carries `color1`–`color4`). Respects `prefers-reduced-motion`. Shader uniform typing is in `src/shaderTypes.ts`.

### Playground (`src/playground/`)
Static gallery of embedded demos (iframes/images), hardcoded in `src/data/playground.ts` (`PLAYGROUND_ITEMS`) — not backed by Firestore.

The embeds are third-party pages (GitHub Pages) carrying their own Three.js build, and cost ~1.4s to come up. **Only about 300ms of that is network** — the rest is the demo's own JS execution and WebGL init, which re-runs on every iframe mount and cannot be prefetched away. `src/playgroundPrefetch.ts` handles the network share:

- `warmPlaygroundEmbeds()` loads each embed once in an offscreen iframe, then **removes it**. The teardown is the point — an earlier version left these mounted, leaving a second live WebGL context rendering at 1x1 against the hero shader. Called on idle from the home page.
- `prefetchPlaygroundRoute()` pulls the lazily-split route chunk.
- `prefetchPlayground()` does both, wired to `NavLink`'s `onIntent` (hover/focus/touch) on the PLAYGROUND link.
- Both no-op under `saveData` or a 2g `effectiveType`.

`index.html` carries a `preconnect`/`dns-prefetch` for the embed origin, which also helps someone landing on `/playground` directly.

Do not put `loading="lazy"` on the embed iframe — it is the page's only real content, and on short viewports it pushed the fetch behind a scroll.

The remaining ~1.1s of boot time is only fixable by not making the user look at it: `PlaygroundItem.poster` renders a still over the embed until it reports `load`, then cuts to the live version. Optional and currently unset on every item.

## Conventions
- TypeScript is `strict` with `noUnusedLocals`/`noUnusedParameters` and `verbatimModuleSyntax` — use `import type { ... }` for type-only imports or the build fails.
- `verbatimModuleSyntax` also means a value-import used only in type positions is still emitted at runtime. Several components reference `THREE.Color` purely to type a `ShaderUniforms` interface, so they must use `import type * as THREE from "three"` — a plain `import * as THREE` there drags all of Three.js into that chunk. `src/components/FragmentShader.tsx` is the only file that needs the real runtime import.
- Styling is plain CSS colocated with components/routes (`*.css` next to the `.tsx`); no CSS framework.
- `.env` holds the Firebase web config as `VITE_FIREBASE_*` vars (public by design for a client Firebase app, but not committed; `.env.example` lists the keys). It *was* tracked until 2026-10-01 and is still in history. That is harmless for a web config, but it is why the repo going public needed no key rotation. `cors.json` is the CORS config for the Firebase Storage bucket.
- `scratch.html` at the repo root is a standalone scratch file, not part of the build.
