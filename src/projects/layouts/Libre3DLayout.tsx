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
 * DRAFT — the prose below is written from the project README and is meant to be
 * edited, not shipped as-is. [Bracketed blanks] are the things the README does
 * not answer: team size, dates, role split, repo URL.
 *
 * This study closes on STATUS, not an outcome. Libre3D is in progress — the
 * editor foundation is working, materials/lighting/import are not built. Saying
 * so plainly is stronger than implying a finish that hasn't happened; revisit
 * the close once there is a shipped milestone to point at.
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
/** TODO: public repo, once it is public. */
const REPO = "https://github.com/[org]/libre3d";

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
          actually ship at, and keeps it. [Your role, team size, and how long you have been building it.]
        </p>
        <p>
          This study covers the foundation, which works today: scene hierarchy, click-to-select, a move/rotate/scale
          gizmo, a resizable preview frame, play mode, and grid and background settings. Materials, lighting, and asset
          import are the next milestones, and are not built yet.
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
          Switching between them is instant and non-destructive — [confirm: is play mode a route, an overlay, or a
          render-mode flag? Say which, briefly, because the "without losing state" claim rests on it].
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

      <CaseStudySection index="/04" label="Implementation" title="A Monorepo Built for the Parts That Don't Exist Yet">
        <p>
          The editor is one app, but it is not the whole product: a viewer widget and a shared UI package are both
          coming, and both will need to share types and components with the editor. Retrofitting that later means moving
          every file. So the workspace is a monorepo from day one — the seams are cut before there is anything to put in
          them.
        </p>
        <Steps>
          <li>
            <div>
              <p>pnpm workspaces and Turborepo manage the packages and cache the task graph.</p>
              <div className="cs-code-row">
                <code>apps/editor</code>
                <code>packages/viewer</code>
                <code>packages/ui</code>
              </div>
            </div>
          </li>
          <li>React 19 and TypeScript for the interface; Vite for the dev server and bundling.</li>
          <li>Three.js renders the WebGL context — the viewport, the grid, and the transform controls.</li>
          <li>
            Zustand holds editor state, versioned and persisted to local storage, which is what makes "your work saves
            itself" true rather than aspirational.
          </li>
        </Steps>
      </CaseStudySection>

      <PaperDiagram
        dense
        summary="One repo → the editor built, the viewer and UI package scaffolded → shared types and components, no migration later"
        caption="The monorepo — one app built, the seams for the next two already cut."
      >
        <PaperGroup label="One workspace, managed by pnpm + Turborepo">
          <PaperGrid>
            <PaperBox title="apps/editor" tint>
              The 3D editor. The only part that is built today.
            </PaperBox>
            <PaperBox title="packages/viewer">The embeddable widget a finished scene will ship into.</PaperBox>
            <PaperBox title="packages/ui">Components both surfaces will share.</PaperBox>
          </PaperGrid>
        </PaperGroup>

        <PaperTurn />

        <PaperNote center>
          the editor and the viewer will share types and components — cutting that seam now costs one afternoon, later
          it costs moving every file
        </PaperNote>

        <PaperGrid>
          <PaperBox title="React 19 + TypeScript" />
          <PaperBox title="Three.js" />
          <PaperBox title="Zustand" />
          <PaperBox title="Vite" />
        </PaperGrid>
      </PaperDiagram>

      <Outcome label="Status" href={REPO} cta="See the repo">
        The editor foundation works end to end — build a scene, adjust it, preview it at output size. Materials,
        lighting, and GLTF import are next.
      </Outcome>
    </CaseStudyLayout>
  );
}
