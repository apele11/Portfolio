import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  Steps,
  VideoFigure,
  SplineFigure,
  MediaRow,
  MediaGroup,
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

const ASSETS = "/assets/compressed/NewBusiness";
const LIVE_SITE = "https://new-biz-case-studies.vercel.app/presentation";
/** The pitch site's hero scene, exported from Spline and served from its CDN. */
const HERO_SCENE = "https://prod.spline.design/hwzfhJT6iymGJQU9/scene.splinecode";
/**
 * The published scene's camera sits at y -2313, below its own artwork (the blobs
 * span -2171..-298), which leaves ~63% of the frame empty at any aspect ratio.
 * -1234 is the artwork's centre, so the frame fills. Remove this once the camera
 * is reframed in Spline itself.
 */
const HERO_SCENE_CAMERA_Y = -1234;

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function NewBusinessLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <CaseStudySection index="/01" label="About">
        <p>
          <strong>New Business: Case Studies</strong> is the pitch site The Agency at UF sends prospective clients
          instead of a PDF proposal. One link, built per prospect, opens into a scroll-driven presentation: a Spline 3D
          hero, the agency's story, the services we provide, then case studies filtered to that prospect's industry and
          a contact close.
        </p>
        <p>
          The Agency was losing pitches to digitally-native agencies. The work wasn't the problem — the format was. A
          PDF in 2026 signals you don't think web-first, and every pitch took days to rebuild by hand. I led design and
          front-end for a team of eight, replacing that process with a system Sofia, their new business lead, runs
          herself. Pitches that took days now take under five minutes.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <div className="cs-reel">
          <VideoFigure
            src={`${ASSETS}/WholeSiteInteraction.mp4`}
            showProgress
            className="cs-reel__hero"
          />

          <MediaRow firstWide className="cs-reel__row">
            <SplineFigure
              scene={HERO_SCENE}
              cameraY={HERO_SCENE_CAMERA_Y}
              poster={`${ASSETS}/NB-Hero.webp`}
              alt="The pitch site's hero — the agency wordmark over an animated Spline 3D scene"
              caption="Hero — Spline 3D, running live"
            />
            <VideoFigure
              src={`${ASSETS}/Case-Study-Inside-Video.mp4`}
              caption="Case studies — filtered by industry"
            />
          </MediaRow>
        </div>

        <VideoFigure
          src={`${ASSETS}/AdminInteraction-Recording.mp4`}
          caption="Admin panel — Sofia builds a prospect link from three fields."
        />
      </MediaGroup>

      <CaseStudySection index="/02" label="Experience" title="Experience Flow">
        <p>
          One link serves two journeys. Sofia adds a prospect in the admin panel and sends the generated URL. The
          prospect opens it into a presentation that already knows who they are — their name woven into the copy, case
          studies ordered for their industry. From there they scroll, switch studies on the dial, or jump through the
          nav bar. Every path stays personalized.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Sofia fills in three fields → a unique web address is created → she sends it → the prospect opens a pitch already written for them"
        caption="How one link works — Sofia's two steps in admin, and what the prospect opens."
      >
        <PaperRow>
          <PaperGroup label="Admin — what Sofia does">
            <PaperBox title="Add a prospect">Their name, company, and which case studies to include.</PaperBox>
            <PaperBox title="Send the link">One web address, unique to that prospect.</PaperBox>
          </PaperGroup>
          <PaperArrow note="email or Slack" />
          <PaperGroup label="Presentation — what the prospect sees">
            <PaperBox title="A pitch that knows them">Their name in the copy, case studies for their industry.</PaperBox>
            <PaperBox title="Wherever they go next">
              Scroll, switch studies, or jump by the nav — it stays theirs.
            </PaperBox>
          </PaperGroup>
        </PaperRow>
      </PaperDiagram>

      <CaseStudySection index="/03" label="Core features" title="A Link That Knows Who Opened It">
        <p>
          I built the link system so each prospect gets a web address of their own, generated from their name and
          company. On open, the presentation fetches that record and weaves the prospect into the copy — so the pitch
          reads as though it was written for them, because it was. Building one takes three fields and a few seconds,
          against the days it used to take to rebuild a deck by hand.
        </p>
      </CaseStudySection>

      <PaperDiagram
        dense
        summary="Three fields → a unique web address → sent by email or Slack → opened in a browser → a pitch written for them"
        caption="One link, end to end — created in seconds, personalized by the time it opens."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · Sofia creates it">
            <PaperBox title="Enter name and company">Two fields in the admin panel.</PaperBox>
            <PaperBox title="Get a web address">Unique to this one prospect.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · The prospect opens it">
            <PaperBox title="They click the link">No login, no download, no PDF.</PaperBox>
            <PaperBox title="The site looks them up">It finds the pitch built for that address.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · The pitch is theirs">
            <PaperBox title="Their industry up front" tint>
              Case studies chosen when the link was made.
            </PaperBox>
          </PaperGroup>
        </PaperRow>
      </PaperDiagram>

      <Band>
        <h2>A Hero That Reveals Itself On Scroll</h2>
        <p>
          I built the hero as a Spline 3D scene the prospect can move the camera through. GSAP drives a scroll-scrubbed
          master timeline: checkpoints fire as the section travels the viewport, and overlapping tweens — the video
          scaling to full screen while the TV overlay fades — make the reveal feel directed rather than mechanical.
        </p>
        <VideoFigure
          src={`${ASSETS}/TV-transition.mp4`}
          caption="The TV reveal — the hero video scales to full screen as the overlay fades."
        />
      </Band>

      <Band>
        <p>
          Every transition earns its place. Moving between sections triggers choreographed reveals, and the Contact
          section flows out of the last case study to close the loop rather than arriving as a new page.
        </p>
        <VideoFigure
          src={`${ASSETS}/ContactUs-Transition.mp4`}
          caption="Contact transition — the final section grows out of the case studies to close the loop."
        />
      </Band>

      <Band>
        <h2>Case Studies That Open On Hover</h2>
        <p>
          In Figma this section was a static grid — clean, and completely expected. During build I redesigned it as an
          accordion that opens on hover: progressive disclosure, more color revealed as you explore, and the same energy
          as the hero. Prospects browse by industry and service type without leaving the page.
        </p>
      </Band>

      <VideoFigure
        src={`${ASSETS}/accordion.mp4`}
        caption="The hover accordion that replaced it — progressive disclosure, more to discover."
      />

      <CaseStudySection index="/04" label="Implementation" title="One Component System, Eight Case Studies">
        <p>
          Eight team members each owned a case study, and quality drifted. Rather than review eight bespoke builds, I
          designed one skeleton and moved every difference into props.
        </p>
        <Steps>
          <li>
            <div>
              <p>Four shared components live in a single module — nothing is duplicated per study.</p>
              <div className="cs-code-row">
                <code>CaseStudyHero</code>
                <code>CaseStudyHeader</code>
                <code>CaseStudyContent</code>
                <code>CaseStudyFooter</code>
              </div>
            </div>
          </li>
          <li>Each study passes its own color, copy, media, and section order. Nothing is rewritten.</li>
          <li>
            Spacing, animation timing, and interaction patterns come from the shared layer, so a minimalist study and an
            image-heavy one still read as one site.
          </li>
          <li>I designed and coded one study end to end as the reference build.</li>
        </Steps>
      </CaseStudySection>

      <PaperDiagram
        dense
        summary="Four components → eight sets of props → eight presentations that still read as one site"
        caption="One skeleton, eight case studies — same four components, different props."
      >
        <PaperGroup label="One shared skeleton — every case study is built from these four">
          <PaperGrid>
            <PaperBox title="Hero">Banner with the client's and the agency's logos.</PaperBox>
            <PaperBox title="Header">Section title, in that client's color.</PaperBox>
            <PaperBox title="Content">Layout wrapper for any kind of section.</PaperBox>
            <PaperBox title="Footer">The closing call to action.</PaperBox>
          </PaperGrid>
        </PaperGroup>

        <PaperTurn />

        <PaperNote center>
          each study passes its own color, copy, media and section order — nothing is rewritten
        </PaperNote>

        <PaperGrid>
          <PaperBox title="Uber" tint />
          <PaperBox title="The Bartram" tint />
          <PaperBox title="Seagram's" tint />
          <PaperBox title="+ five more" tint />
        </PaperGrid>
      </PaperDiagram>

      <Outcome label="Outcome" href={LIVE_SITE} cta="See the live site — best on desktop">
        Eight case studies on one system. A pitch that took days now takes under five minutes.
      </Outcome>
    </CaseStudyLayout>
  );
}
