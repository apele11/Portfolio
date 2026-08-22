import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  Steps,
  VideoFigure,
  MediaRow,
  MediaGroup,
  PaperDiagram,
  PaperRow,
  PaperGroup,
  PaperBox,
  PaperGrid,
  PaperArrow,
  PaperTurn,
  Outcome,
} from "../case-study";

const ASSETS = "/assets/compressed/NewBusiness";
const LIVE_SITE = "https://new-biz-case-studies.vercel.app/presentation";

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function NewBusinessLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <CaseStudySection index="/01" label="About">
        <p>
          <strong>New Business: Case Studies</strong> is the pitch site The Agency at UF sends prospective clients.
          Each company has its own custom case study collection and URL based on industry and service type. The site 
          is dynamic and immersive; it opens into a choose your own adventure & scroll-driven presentation that includes: 
          a Spline 3D hero, The Agency's story, the services provided, curated case studies, and a contact card.
        </p>
        <p>
          Previously, The Agency at UF was using PowerPoint pitch decks which were time consuming, and many agencies had started
          using web format in the space. Taking this ask head on, I led design and front-end dev team of eight, replacing that process with a system Sofia Portugal, former Accounts & Operations Manager, can run
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
            {/* A recording of the hero rather than the live Spline scene. The
                runtime pulls WASM from Spline's CDN and struggled on phones;
                this is the same footage the project thumbnail uses. */}
            <VideoFigure
              src={`${ASSETS}/heroSection.mp4`}
              poster={`${ASSETS}/NB-Hero.webp`}
              caption="Hero — Spline 3D scene"
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
          The user flow starts with Sofia adding a potential client in the admin panel and sending them the generated URL.
          Prospective client opens into a presentation with case studies customized for their industries and services. Example of 
          services include: media, production, copywriting, graphic design, web development. Industries include: entertainment, food, technology, etc.
          From there they scroll, switch studies on the dial, or jump through the
          nav bar. Every path stays personalized.
        </p>
      </CaseStudySection>

      <PaperDiagram>
        <PaperRow>
          <PaperGroup label="Admin — what Sofia does">
            <PaperBox title="Add a prospect">Their name, company, and which case studies to include.</PaperBox>
            <PaperBox title="Send the link">One web address, unique to that prospect.</PaperBox>
          </PaperGroup>
          <PaperArrow note="email or Slack" />
          <PaperGroup label="Presentation — what the potential client sees">
            <PaperBox title="Cutomized case studies">Tour The Agency's previous work that relates to their industry & service ask. </PaperBox>
            <PaperBox title="Choose your own adventure">
              Scroll, switch studies, or jump by the nav bar; explore via prioritizing interests.
            </PaperBox>
            <PaperBox title="Contact The Agency at UF">
              Reach out to us via contact form auto sends email & social media links.
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

      <CaseStudySection index="/03" label="Implementation" title="Using a Modular System">
        <p>
          Unifying the project across team member pages by creating a resusable component system and a consistent user experience.
        </p>
        <Steps>
          <li>
            <div>
              <p>Four shared components live in a single module.</p>
              <div className="cs-code-row">
                <code>CaseStudyHero</code>
                <code>CaseStudyHeader</code>
                <code>CaseStudyContent</code>
                <code>CaseStudyFooter</code>
              </div>
            </div>
          </li>
          <li>Each study passes its own color, copy, media, and section order.</li>
          <li>
            Spacing, animation timing, and sizing come from the shared layer.
          </li>
          <li>Started with designing and coding one study end to end as the reference build.</li>
        </Steps>
      </CaseStudySection>

      <PaperDiagram
        dense
      >
        <PaperGroup label="One shared skeleton — every case study is built from these four">
          <PaperGrid>
            <PaperBox title="Hero">Banner with the client's and The Agency's logos.</PaperBox>
            <PaperBox title="Header">Section title, in that client's color.</PaperBox>
            <PaperBox title="Content">Layout wrapper for any kind of section.</PaperBox>
            <PaperBox title="Footer">The closing call to action.</PaperBox>
          </PaperGrid>
        </PaperGroup>

        <PaperTurn />

        <PaperGrid>
          <PaperBox title="Uber" tint />
          <PaperBox title="The Bartram" tint />
          <PaperBox title="Seagram's" tint />
          <PaperBox title="+ more" tint />
        </PaperGrid>
      </PaperDiagram>

      <Outcome label="Outcome" href={LIVE_SITE} cta="See the live site — best on desktop">
        All case studies on one immersive site. A pitch that took days now takes under five minutes!
      </Outcome>
    </CaseStudyLayout>
  );
}
