import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  Steps,
  Figure,
  VideoFigure,
  MediaRow,
  MediaGroup,
  MediaCompare,
  PaperDiagram,
  PaperRow,
  PaperGroup,
  PaperBox,
  PaperGrid,
  PaperArrow,
  PaperTurn,
  PaperNote,
  Outcome,
} from "../case-study";

/*
 * Written against the shipped editor as of August 2026 — cross-checked against
 * the repo's docs/project_index.md and docs/architecture.md rather than the
 * README, which still describes the pre-publish, pre-materials build.
 *
 * This study closes on STATUS, not an outcome, because Libre3D is still in
 * progress. Keep it that way until there is a public release to point at.
 *
 * The repo is private, so the Outcome CTA is deliberately absent — a "see the
 * repo" link that 404s reads worse than no link. Restore `href`/`cta` on
 * <Outcome> pointing at github.com/The-Agency-at-UF/Libre3D once it is public.
 *
 * Media: the files in MEDIA do not exist yet. Drop raw captures into
 * public/assets/Libre3D/ and run `npm run assets` — that writes them to
 * public/assets/compressed/Libre3D/, which is what ASSETS points at. Until then
 * images fall back to the cover and videos show it as a poster, so the page
 * lays out correctly with nothing broken on screen.
 */

const ASSETS = "/assets/compressed/Libre3D";
/** Stands in for art that has not been shot yet — the one Libre3D asset that exists. */
const PLACEHOLDER = `${ASSETS}/Libre3D-Cover.webp`;

/** Media this layout expects. Names are provisional — rename freely, in pairs. */
const MEDIA = {
  /** Hero: one slow pass across the working editor. */
  overview: `${ASSETS}/Editor-Overview.mp4`,
  /** Still: the editor at rest, well-composed. */
  editor: `${ASSETS}/Editor-Still.webp`,
  /** Still: the background + grid settings panel. */
  gridPanel: `${ASSETS}/Grid-Settings.webp`,
  /** Clip: hierarchy rename / hide / lock, synced to viewport selection. */
  hierarchy: `${ASSETS}/Hierarchy.mp4`,
  /** Clip: translate → rotate → scale on one object. */
  gizmo: `${ASSETS}/Gizmo.mp4`,
  /** Clip: 1920x1080 → 1080x1080 → custom, preview rescaling to fit. */
  frames: `${ASSETS}/Frame-Sandbox.mp4`,
  /** Stills: edit mode and play mode, same scene, same camera. */
  editMode: `${ASSETS}/Edit-Mode.webp`,
  playMode: `${ASSETS}/Play-Mode.webp`,
  /** Clip: drag a .glb in, hierarchy populates collapsed, node reattaches in place. */
  glbImport: `${ASSETS}/GLB-Import.mp4`,
  /** Still: the Materials panel — colour layer above, lighting layer below. */
  materials: `${ASSETS}/Materials-Panel.webp`,
  /** Clip: Share → publish → copy link → open the viewer route on the link. */
  publish: `${ASSETS}/Publish-Share.mp4`,
};

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function Libre3DLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack} tone="cool">
      <CaseStudySection index="/01" label="About">
        <p>
          <strong>Libre3D</strong> is an open-source, code-free 3D editor that runs in the browser — an alternative to
          Spline for building interactive 3D elements for the web. It is being built for the creative team at The Agency
          at UF, who need 3D on client work without a Three.js developer attached to every project.
        </p>
        <p>
          Building 3D for the web today means one of three things: writing custom code, standing up an asset pipeline,
          or accepting a closed-source tool's terms about what you may do with scenes you made yourself. Libre3D is the
          fourth option — a workspace where a non-technical designer assembles a scene, previews it at the size it will
          actually ship at, and keeps it. I have been building it since June 2026 and have written effectively all of
          it: architecture, editor, and the publish pipeline behind it.
        </p>
        <p>
          What works today: scene hierarchy with drag-to-reparent, click-to-select and box-select, a move/rotate/scale
          gizmo, a resizable preview frame, play mode, grid and background settings, a layered material inspector, GLB
          import, and publishing a scene to a shareable link. Lighting beyond a single directional light, and
          multi-user editing, are still ahead.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <div className="cs-reel">
          <VideoFigure src={MEDIA.overview} poster={PLACEHOLDER} showProgress className="cs-reel__hero" />

          <MediaRow firstWide className="cs-reel__row">
            <Figure
              src={PLACEHOLDER}
              alt="The Libre3D editor — scene hierarchy on the left, 3D viewport centre, settings on the right"
              caption="The editor at rest"
            />
            <VideoFigure
              src={MEDIA.hierarchy}
              poster={PLACEHOLDER}
              caption="Hierarchy — rename, hide, lock, delete"
            />
          </MediaRow>
        </div>

        <VideoFigure
          src={MEDIA.gizmo}
          poster={PLACEHOLDER}
          caption="The transform gizmo — one handle for move, rotate, and scale, built on Three.js."
        />
      </MediaGroup>

      <CaseStudySection index="/02" label="Experience" title="One Loop, Not a Pipeline">
        <p>
          A 3D tool is easy to build as a pipeline — model, then configure, then export — and miserable to use that way,
          because the answer to "does this look right?" lives at the far end of it. Libre3D is built as a loop instead.
          You place something, adjust it, and check it at real output size without leaving the workspace or losing
          state. The scene persists continuously, so the loop never costs you anything to re-enter.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Place an object → adjust it → check it at output size → back to placing, with the scene saved the whole way"
        caption="The editing loop — three moves, no dead ends, nothing to re-set up on the way round."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · Place">
            <PaperBox title="Add to the scene">It appears in the hierarchy and the viewport together.</PaperBox>
            <PaperBox title="Click to select">Pick it in 3D, or pick its row in the list.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · Adjust">
            <PaperBox title="Move, rotate, scale">One on-screen handle does all three.</PaperBox>
            <PaperBox title="Set the ground">Background colour, and which grid you sight against.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · Check">
            <PaperBox title="At real output size" tint>
              Resize the frame, or drop into play mode to see it clean.
            </PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperNote center>
          the scene saves itself continuously — going round again costs nothing to set back up
        </PaperNote>
      </PaperDiagram>

      <CaseStudySection index="/03" label="Core feature" title="Previewing at the Size It Will Actually Ship At">
        <p>
          The failure mode of a 3D editor is that the thing you tuned in a big editor viewport looks wrong in the small
          box it ships into on a client's site. So the preview frame is a first-class object: set it to 1920×1080, to a
          1080×1080 square, or to a custom size, and the viewport scales itself down to fit the space left beside your
          panels — 83%, say — while holding the true proportions. What you are judging is the real frame, shrunk, not a
          different frame.
        </p>
        <p>
          Play mode is the other half of the same idea. It drops the editor chrome and shows the scene the way an end
          user gets it, and it costs nothing to enter or leave because it does not touch your editing state.
        </p>
      </CaseStudySection>

      <VideoFigure
        src={MEDIA.frames}
        poster={PLACEHOLDER}
        caption="The frame sandbox — switching output sizes, with the preview rescaling to fit the workspace."
      />

      <Band>
        <h2>Play Mode, Without Losing Your Place</h2>
        <p>
          Same scene, same camera, two views: the workspace you build in, and the clean render your user receives.
          Play mode is a flag on the store, not a route — flipping it exports the live scene to an in-memory GLB, hands
          the blob to <code>&lt;model-viewer&gt;</code>, and parks the editor's render loop until you come back. Your
          entities are never touched, which is why leaving costs nothing: the object URL is revoked and the loop
          resumes.
        </p>
        <MediaCompare>
          <Figure src={PLACEHOLDER} alt="The editor with panels, gizmo and grid visible" label="Edit" />
          <Figure src={PLACEHOLDER} alt="The same scene in play mode, chrome removed" label="Play" />
        </MediaCompare>
      </Band>

      <Band>
        <h2>Selection That Does What You Meant</h2>
        <p>
          Click-to-select in a 3D viewport is deceptively hard: the transform gizmo is itself geometry sitting in front
          of the object it controls, so a naive raycast grabs the handle instead of the thing. Selection ignores the
          gizmo's own meshes, and the guideline clutter Three.js ships on its transform controls is pruned at
          initialisation, so the handles read as handles rather than as scene content.
        </p>
        <p>
          It is invisible work — nobody notices selection that behaves. They only ever notice the version that doesn't.
        </p>
      </Band>

      <CaseStudySection index="/04" label="Bringing work in" title="An Import That Doesn't Bury You in Bones">
        <p>
          A designer's first real scene starts with a model somebody else made, so GLB import had to work before
          anything else was worth building. The naive version walks every node glTF gives you and lists them all — which
          turns one rigged character into several hundred outliner rows of bones and empty transform groups, and makes
          the hierarchy panel useless at exactly the moment you first need it.
        </p>
        <p>
          So import prunes as it reads: empty and pass-through nodes are folded away, imported nodes arrive collapsed
          rather than fully expanded, and materials come across with their glTF <code>alphaMode</code> and{" "}
          <code>doubleSided</code> flags intact instead of being flattened to a default. Re-importing a single node
          reattaches it in place with a fade rather than reloading the whole subtree, so correcting one asset does not
          cost you the scene you had arranged around it.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <VideoFigure
          src={MEDIA.glbImport}
          poster={PLACEHOLDER}
          caption="GLB import — the hierarchy populates pruned and collapsed, not as a wall of bones."
        />
        <Figure
          src={MEDIA.materials}
          alt="The Materials panel — a colour layer above a lighting layer, each with its own controls"
          caption="Materials as layers: colour and lighting, each independently toggled."
        />
      </MediaGroup>

      <Band>
        <h2>Materials as Layers, Not a Form</h2>
        <p>
          The material inspector is built as a stack of layers rather than one flat panel of every property a Three.js
          material happens to expose. A colour layer carries fill, opacity, alpha mode, alpha cutoff and double-sidedness;
          a lighting layer carries the model, and then only the controls that model actually has — roughness and
          metalness for standard, shininess for phong, emissive for both. Choosing the model first means you are never
          reading a slider that does nothing.
        </p>
      </Band>

      <CaseStudySection index="/05" label="Core feature" title="A Link You Can Send a Client">
        <p>
          A scene that only exists in the tab you built it in is a demo, not a deliverable. Publishing is what makes
          Libre3D usable on client work: the editor exports the scene to GLB, the API mints a scene id and a presigned
          S3 URL, and the browser uploads the file straight to S3 — the bytes never pass through the server. A DynamoDB
          record keyed by that id is what the read-only viewer route reads back.
        </p>
        <p>
          The decision that matters is not in that flow, though. Re-publishing reuses the existing scene id rather than
          minting a new one, so a link a designer already sent a client keeps resolving after the scene behind it is
          updated. Publishing at all is the engineering; the link surviving the next revision is the product.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Export to GLB → API mints an id and a presigned URL → browser uploads straight to S3 → the viewer route reads the record back"
        caption="The publish pipeline — the file goes to storage directly, and the id is the thing worth keeping."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · In the editor">
            <PaperBox title="Export the scene">The live scene is serialised to a GLB blob.</PaperBox>
          </PaperGroup>
          <PaperArrow note="POST" />
          <PaperGroup label="02 · The API">
            <PaperBox title="Mint an id" tint>
              Reuses the scene's existing id on a re-publish, so the link stays put.
            </PaperBox>
            <PaperBox title="Sign an upload URL">A presigned S3 PUT, scoped to that one object key.</PaperBox>
            <PaperBox title="Write the record">DynamoDB holds where the asset lives.</PaperBox>
          </PaperGroup>
          <PaperArrow note="PUT" />
          <PaperGroup label="03 · Storage and back out">
            <PaperBox title="Straight to S3">The browser uploads the blob itself — no server in the path.</PaperBox>
            <PaperBox title="The viewer route">Reads the record by id and renders the asset read-only.</PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperNote center>
          the id is the durable thing — the asset behind it can be replaced as often as you like
        </PaperNote>
      </PaperDiagram>

      <VideoFigure
        src={MEDIA.publish}
        poster={PLACEHOLDER}
        caption="Publish and share — the scene goes up, the link comes back, and it keeps working on the next revision."
      />

      <CaseStudySection index="/06" label="Implementation" title="A Monorepo Built for the Parts That Don't Exist Yet">
        <p>
          The editor is one app, but it is not the whole product: the published viewer wants to become an embeddable
          widget, and it will need to share types and components with the editor when it does. Retrofitting that later
          means moving every file. So the workspace is a monorepo from day one — today it holds a single app, and the
          viewer still lives inside it as a route, but splitting either one out is a move rather than a migration.
        </p>
        <Steps>
          <li>
            <div>
              <p>pnpm workspaces and Turborepo manage the packages and cache the task graph.</p>
              <div className="cs-code-row">
                <code>apps/editor</code>
                <code>/v/:sceneId</code>
              </div>
            </div>
          </li>
          <li>React 19 and TypeScript for the interface; Vite for the dev server and bundling.</li>
          <li>
            Three.js renders the WebGL context directly — no react-three-fiber. The scene is user data arriving from
            the store, from GLB imports and from undo, so a reconciler I control beats a declarative one I configure —
            and geometry, materials and textures have to be disposed by hand or the app leaks GPU memory across edits.
          </li>
          <li>
            Zustand holds editor state, versioned and persisted to local storage, which is what makes "your work saves
            itself" true rather than aspirational. Undo is middleware over the same store, so a feature wired through
            it gets <code>Ctrl+Z</code> for free.
          </li>
          <li>S3 and DynamoDB behind the publish route, reached through presigned uploads.</li>
        </Steps>
      </CaseStudySection>

      <PaperDiagram
        dense
        summary="You act → the store changes → the Three.js scene is reconciled to match → the screen redraws"
        caption="One loop, and everything is a variation on it — which is why undo, autosave and import all cost nothing to support."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · React">
            <PaperBox title="Panels and viewport">Read the store through selectors, write to it through actions.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · The store">
            <PaperBox title="One source of truth" tint>
              Entities, selection, cameras, settings — persisted and undoable.
            </PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · Managers">
            <PaperBox title="Reconcile, don't mutate">
              The entity list is diffed against the live meshes: dispose what is gone, create what is new, update the
              rest.
            </PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperTurn />

        <PaperNote center>
          the store is the truth and the 3D scene is derived from it — so undo, autosave, GLB import and paste are all
          the same code path
        </PaperNote>

        <PaperGrid>
          <PaperBox title="React 19 + TypeScript" />
          <PaperBox title="Three.js" />
          <PaperBox title="Zustand" />
          <PaperBox title="S3 + DynamoDB" />
        </PaperGrid>
      </PaperDiagram>

      <Outcome label="Status">
        The editor works end to end today — build a scene or import one, give it materials, preview it at output size,
        and publish it to a link you can send. Richer lighting and multi-user editing are next.
      </Outcome>
    </CaseStudyLayout>
  );
}
