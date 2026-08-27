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
 * The frame sandbox is deliberately not covered here. It is in the build, but it
 * does not hold up well enough to demo, and a case study that claims a feature
 * it cannot show is worse than one that stays quiet about it. If it gets solid,
 * the section to restore sits between /02 and play mode: the pitch was that a
 * preview frame set to real output size beats judging a scene in a big editor
 * viewport. Do not restore it before the capture exists.
 *
 * Media: everything here is shot except `overview` (the hero) and `publish`,
 * which still fall back to the cover — the hero is the conspicuous one, since
 * it is the first thing on the page. `editor` and `gridPanel` are named but
 * unused; nothing references them.
 *
 * Drop raw files into public/assets/Libre3D/ and run `npm run assets` — that
 * writes them to public/assets/compressed/Libre3D/, which is what ASSETS points
 * at. Until a file lands, images fall back to the cover and videos show it as a
 * poster, so the page lays out correctly with nothing broken on screen.
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
  /** Clip: hierarchy rename / hide / lock / delete, synced to viewport selection. */
  hierarchy: `${ASSETS}/Hierarchy.mp4`,
  /** Clips: the gizmo's three moves, one per clip. Real captures, 2560x1600 —
   *  the object sits centred, so the square crop in the row below trims panels
   *  rather than content. */
  translate: `${ASSETS}/Translate.mp4`,
  rotate: `${ASSETS}/Rotate.mp4`,
  scale: `${ASSETS}/Scale.mp4`,
  /** Clip: box-select across three primitives, group them, move the group as one, undo back. */
  selection: `${ASSETS}/Selection-Grouping-Undo.mp4`,
  /** Stills: edit mode and play mode — one cube, same camera, chrome on and off.
   *  They only work as a pair, so reshoot both or neither. */
  editMode: `${ASSETS}/Edit-Mode.webp`,
  playMode: `${ASSETS}/Play-Mode.webp`,
  /** Clip: pick a .glb from disk, it lands in the viewport, hierarchy populates collapsed. */
  glbImport: `${ASSETS}/ImportModelDemo.mp4`,
  /** Clip: select a sub-mesh, work its colour and lighting layers, changes land live. */
  materials: `${ASSETS}/MaterialInspection.mp4`,
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
          <strong>Libre3D</strong> is an open-source, code-free 3D editor that runs in the browser, and an
          alternative to Spline for building interactive 3D elements for the web. It is being built for the creative
          team at The Agency at UF, who need 3D on client work without a Three.js developer attached to every project.
        </p>
        <p>
          Building 3D for the web today means one of three things: writing custom code, standing up an asset pipeline,
          or accepting a closed-source tool's terms about what you may do with scenes you made yourself. Libre3D is
          the fourth option. It is a workspace where a non-technical designer assembles a scene, checks it the way a
          viewer will see it, and keeps it. I have been building it since June 2026 and have written effectively all of
          it: architecture, editor, and the publish pipeline behind it.
        </p>
        <p>
          What works today: scene hierarchy with drag-to-reparent, click-to-select and box-select, grouping and undo, a
          move/rotate/scale gizmo, play mode, grid and background settings, a layered material inspector, GLB import,
          and publishing a scene to a shareable link. Lighting beyond a single directional light, and multi-user
          editing, are still ahead.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <div className="cs-reel">
          <VideoFigure src={MEDIA.overview} poster={PLACEHOLDER} showProgress className="cs-reel__hero" />

          {/* No posters: these three are shot, so the browser paints their own
              first frame. The cover stands in elsewhere because those files are
              not captured yet — using it here would crop a landscape still of a
              different thing into a square that is about to be replaced. */}
          {/* One word each. Three cells of the same gizmo doing three things is
              already the whole caption; a sentence under each ran to three
              lines at three-across on a phone and left the row ragged. */}
          <MediaRow square className="cs-reel__row">
            <VideoFigure src={MEDIA.translate} caption="Move" />
            <VideoFigure src={MEDIA.rotate} caption="Rotate" />
            <VideoFigure src={MEDIA.scale} caption="Scale" />
          </MediaRow>
        </div>

        {/* Full measure rather than a cell in a row. This sat beside an "editor
            at rest" still that showed the same workspace this clip opens on, so
            the row was spending half its width restating its other half. A lone
            figure is not a row — dropping the wrapper lets the clip run the
            whole measure at its own ratio instead of being cropped to a cell. */}
        <VideoFigure src={MEDIA.hierarchy} caption="The hierarchy panel renames, hides, locks and deletes, staying in sync with whatever is selected in the viewport." />
      </MediaGroup>

      <CaseStudySection index="/02" label="Experience" title="One Loop, Not a Pipeline">
        <p>
          A 3D tool is easy to build as a pipeline that goes model, then configure, then export. It is miserable to
          use that way, because the answer to "does this look right?" lives at the far end of it. Libre3D is built as a
          loop instead.
          You place something, adjust it, and check it clean without leaving the workspace or losing state. The scene
          persists continuously, so the loop never costs you anything to re-enter.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Place an object → adjust it → check it without the editor chrome → back to placing, with the scene saved the whole way"
        caption="The editing loop has three moves and no dead ends, and nothing needs re-setting up on the way round."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · Place">
            <PaperBox title="Add to the scene">It appears in the hierarchy and the viewport together.</PaperBox>
            <PaperBox title="Click to select">Pick it in 3D, or pick its row in the list.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · Adjust">
            <PaperBox title="Move, rotate, scale">One on-screen handle does all three.</PaperBox>
            <PaperBox title="Set the ground">You set the background colour and the grid you sight against.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · Check">
            <PaperBox title="Without the chrome" tint>
              Drop into play mode and see the scene the way your user gets it.
            </PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperNote center>
          The scene saves itself continuously, so going round again costs nothing to set back up.
        </PaperNote>
      </PaperDiagram>

      <CaseStudySection index="/03" label="Core feature" title="Seeing It the Way Your User Will">
        <p>
          The failure mode of a 3D editor is that the thing you tuned surrounded by panels, grids and gizmos looks
          wrong the moment it ships without them. Every one of those is scene content the end user never receives, and
          after an hour inside the workspace you have stopped seeing that they are there at all.
        </p>
        <p>
          So play mode is a first-class move rather than an export step. It drops the editor chrome and shows the scene
          the way an end user gets it, and it costs nothing to enter or leave because it does not touch your editing
          state. That last part is what makes it useful rather than merely present: a check you can run in one click is
          a check you will actually run.
        </p>
      </CaseStudySection>

      <Band>
        <h2>Play Mode, Without Losing Your Place</h2>
        <p>
          Same scene, same camera, two views: the workspace you build in, and the clean render your user receives.
          Play mode is a flag on the store rather than a route. Flipping it exports the live scene to an in-memory
          GLB, hands the blob to <code>&lt;model-viewer&gt;</code>, and parks the editor's render loop until you come
          back. Your
          entities are never touched, which is why leaving costs nothing: the object URL is revoked and the loop
          resumes.
        </p>
        <MediaCompare>
          <Figure
            src={MEDIA.editMode}
            alt="The editor: the same cube with hierarchy, settings panel, transform gizmo and grid around it"
            label="Edit"
          />
          <Figure
            src={MEDIA.playMode}
            alt="The same cube in play mode, on an empty ground with every panel and the grid gone"
            label="Play"
          />
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
          It is invisible work, because nobody notices selection that behaves. They only ever notice the version that
          doesn't.
        </p>
        <p>
          It is also what everything above it stands on. Box-select takes several objects at once, grouping folds them
          into a single node that moves, rotates and scales as one, and the gizmo re-centres on the group rather than
          on whichever object you happened to pick last. That detail is what makes a group feel like one object instead
          of a list of them. All of it is undoable, which is the real permission slip: arranging a scene is only worth
          experimenting with if getting it wrong is free.
        </p>
        <VideoFigure
          src={MEDIA.selection}
          caption="Selecting across several objects groups them, the group then moves as one, and undo walks the whole arrangement back."
        />
      </Band>

      <CaseStudySection index="/04" label="Bringing work in" title="An Import That Doesn't Bury You in Bones">
        <p>
          A designer's first real scene starts with a model somebody else made, so GLB import had to work before
          anything else was worth building. The naive version walks every node glTF gives you and lists them all. That
          turns one rigged character into several hundred outliner rows of bones and empty transform groups, and it
          makes the hierarchy panel useless at exactly the moment you first need it.
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
          caption="On import the model lands in the viewport, and the hierarchy populates pruned and collapsed rather than as a wall of bones."
        />
        <VideoFigure
          src={MEDIA.materials}
          caption="Picking a sub-mesh opens its colour and lighting layers in the material inspector, and the model responds live."
        />
      </MediaGroup>

      <Band>
        <h2>Materials as Layers, Not a Form</h2>
        <p>
          The material inspector is built as a stack of layers rather than one flat panel of every property a Three.js
          material happens to expose. A colour layer carries fill, opacity, alpha mode, alpha cutoff and double-sidedness;
          a lighting layer carries the model, and then only the controls that model actually has, which means
          roughness and metalness for standard, shininess for phong, and emissive for both. Choosing the model first
          means you are never reading a slider that does nothing.
        </p>
      </Band>

      <CaseStudySection index="/05" label="Core feature" title="A Link You Can Send a Client">
        <p>
          A scene that only exists in the tab you built it in is a demo, not a deliverable. Publishing is what makes
          Libre3D usable on client work: the editor exports the scene to GLB, the API mints a scene id and a presigned
          S3 URL, and the browser uploads the file straight to S3, so the bytes never pass through the server. A
          DynamoDB record keyed by that id is what the read-only viewer route reads back.
        </p>
        <p>
          The decision that matters is not in that flow, though. Re-publishing reuses the existing scene id rather than
          minting a new one, so a link a designer already sent a client keeps resolving after the scene behind it is
          updated. Publishing at all is the engineering; the link surviving the next revision is the product.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Export to GLB → API mints an id and a presigned URL → browser uploads straight to S3 → the viewer route reads the record back"
        caption="In the publish pipeline the file goes to storage directly, and the id is the thing worth keeping."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · In the editor">
            <PaperBox title="Export the scene">The live scene is serialised to a GLB blob.</PaperBox>
          </PaperGroup>
          <PaperArrow note="POST" />
          <PaperGroup label="02 · The API">
            <PaperBox title="Mint an id" tint>
              It reuses the scene's existing id on a re-publish, so the link stays put.
            </PaperBox>
            <PaperBox title="Sign an upload URL">It signs a presigned S3 PUT, scoped to that one object key.</PaperBox>
            <PaperBox title="Write the record">DynamoDB holds where the asset lives.</PaperBox>
          </PaperGroup>
          <PaperArrow note="PUT" />
          <PaperGroup label="03 · Storage and back out">
            <PaperBox title="Straight to S3">The browser uploads the blob itself, with no server in the path.</PaperBox>
            <PaperBox title="The viewer route">It reads the record by id and renders the asset read-only.</PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperNote center>
          The id is the durable thing, and the asset behind it can be replaced as often as you like.
        </PaperNote>
      </PaperDiagram>

      <VideoFigure
        src={MEDIA.publish}
        poster={PLACEHOLDER}
        caption="Publishing sends the scene up and hands back a link, and that link keeps working on the next revision."
      />

      <CaseStudySection index="/06" label="Implementation" title="A Monorepo Built for the Parts That Don't Exist Yet">
        <p>
          The editor is one app, but it is not the whole product: the published viewer wants to become an embeddable
          widget, and it will need to share types and components with the editor when it does. Retrofitting that later
          means moving every file. So the workspace is a monorepo from day one. Today it holds a single app, and the
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
          <li>React 19 and TypeScript build the interface, and Vite runs the dev server and the bundling.</li>
          <li>
            Three.js renders the WebGL context directly, without react-three-fiber. The scene is user data arriving
            from the store, from GLB imports and from undo, so a reconciler I control beats a declarative one I
            configure. Geometry, materials and textures also have to be disposed by hand, or the app leaks GPU memory
            across edits.
          </li>
          <li>
            Zustand holds editor state, versioned and persisted to local storage, which is what makes "your work saves
            itself" true rather than aspirational. Undo is middleware over the same store, so a feature wired through
            it gets <code>Ctrl+Z</code> for free.
          </li>
          <li>S3 and DynamoDB sit behind the publish route, reached through presigned uploads.</li>
        </Steps>
      </CaseStudySection>

      <PaperDiagram
        dense
        summary="You act → the store changes → the Three.js scene is reconciled to match → the screen redraws"
        caption="Everything is a variation on one loop, which is why undo, autosave and import all cost nothing to support."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · React">
            <PaperBox title="Panels and viewport">They read the store through selectors and write to it through actions.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · The store">
            <PaperBox title="One source of truth" tint>
              Entities, selection, cameras and settings are all persisted and undoable.
            </PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · Managers">
            <PaperBox title="Reconcile, don't mutate">
              The entity list is diffed against the live meshes, so what is gone is disposed, what is new is created,
              and the rest is updated.
            </PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperTurn />

        <PaperNote center>
          The store is the truth and the 3D scene is derived from it, so undo, autosave, GLB import and paste are all
          the same code path.
        </PaperNote>

        <PaperGrid>
          <PaperBox title="React 19 + TypeScript" />
          <PaperBox title="Three.js" />
          <PaperBox title="Zustand" />
          <PaperBox title="S3 + DynamoDB" />
        </PaperGrid>
      </PaperDiagram>

      <Outcome label="Status">
        The editor works end to end today. You can build a scene or import one, give it materials, check it in play
        mode, and publish it to a link you can send. Richer lighting and multi-user editing are next.
      </Outcome>
    </CaseStudyLayout>
  );
}
