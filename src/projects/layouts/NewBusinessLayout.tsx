import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Decision,
  PullQuote,
  LearningItem,
  ScopeBlock,
  SystemMap,
  CtaLink,
  Figure,
  ScrollFigure,
  VideoFigure,
  MediaCompare,
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
      <CaseStudySection title="What it is" plain>
        <p>
          The Agency at UF is a student-run advertising agency. <strong>New Business: Case Studies</strong> is the site they send prospective clients instead of a PDF proposal — one link, built per prospect, that opens into a scroll-driven presentation: a Spline 3D hero, the agency's story, then case studies filtered to that prospect's industry and a contact close.
        </p>
        <p>
          Sofia, their new business lead, generates each link from an admin panel in under five minutes. It used to take days.
        </p>
        <ScrollFigure
          src={`${ASSETS}/Pitch.webp`}
          alt="The full New Business pitch site — hero, agency intro, services, case studies, and contact"
          caption="The shipped pitch, top to bottom — scroll inside the frame. Hero, the agency's story, services, case studies, contact."
          size="bleed"
        />
        <ScopeBlock
          team="A team of 8. I led design and implementation; each member owned one case study."
          mine={[
            "Creative direction and interaction model",
            "The complete Figma design system",
            "The Spline 3D hero and its GSAP scroll choreography",
            "The universal component system that unified all 8 case studies",
            "One full case study, designed and coded end to end",
            "Admin panel UX and information architecture",
          ]}
          others={[
            "Admin panel implementation (lead developer)",
            "7 of 8 case study builds (team, on my components)",
          ]}
        />
      </CaseStudySection>

      <CaseStudySection index="01" title="Context">
        <p>
          The Agency at UF pitches to prospective clients to win new business. They were losing pitches to digitally-native agencies. The problem wasn't their work—it was how they presented it. Sending a PDF in 2026 signaled something dangerous: <em>we're not serious about web-first thinking</em>.
        </p>
        <p>
          Every pitch also took days to customize. Pull case studies, reorder slides, rebuild the narrative for each prospect. It was unsustainable.
        </p>
        <p>
          The brief was one line: replace the PDF with something that adapts to what <em>they</em> care about, and that <em>feels</em> like The Agency. Management knew interactivity had to be central. Beyond that, the creative direction was wide open — and the repository was empty.
        </p>
      </CaseStudySection>

      <CaseStudySection index="02" title="The opportunity">
        <p>
          I arrived to an empty repository and a clear deliverable. That meant creative freedom.
        </p>
        <p>
          I saw an opportunity to bring my passion for 3D and shaders on the web into this project. Instead of a traditional site, what if we built something that felt alive? Interactive. Animated. Something that showcased The Agency's sophistication not just through case studies, but through <em>how</em> you experienced them?
        </p>
      </CaseStudySection>

      <CaseStudySection index="03" title="The approach">
        <p>
          I started by asking: <strong>What transitions create narrative? How do we build momentum and keep someone engaged as they scroll?</strong>
        </p>
        <p>
          I researched reference sites The Agency provided, looking for interaction patterns that felt premium without being gimmicky. Then I sketched on paper—defining the structure, the transitions between sections, the interaction model.
        </p>
        <PullQuote>The paper sketch mapped a three-section journey. Every animation had a purpose.</PullQuote>
        <Figure
          src={`${ASSETS}/New-Biz-Sketch-1.webp`}
          alt="Hand-drawn paper sketch mapping the three-section journey and transitions"
          caption="Paper sketch — the three-section journey and its transitions, mapped before Figma."
          size="inset"
        />
        <h3>Design in Figma</h3>
        <p>
          I moved the sketch to Figma and built a complete visual system. The hero section became the anchor—the showstopper. I pulled from The Agency's brand book: vibrant gradients, dynamic shapes, a sense of motion even before you interact.
        </p>
        <p>The design locked in:</p>
        <ul>
          <li><strong>Hero:</strong> Full-screen interactive experience with 3D and GSAP animations</li>
          <li><strong>"What is The Agency":</strong> Story-driven, introducing the team and POV</li>
          <li><strong>"Our Services":</strong> Tied to relevant work examples</li>
          <li><strong>"Our Work":</strong> Case studies, filterable by industry and service type</li>
          <li><strong>Contact:</strong> A final transition to close the loop</li>
        </ul>
        <p>
          Every section transition was designed to guide the viewer, build momentum, and reinforce that this is not a static proposal—it's an experience.
        </p>
      </CaseStudySection>

      <CaseStudySection index="04" title="Creative decisions">
        <p>
          Craft only reads if you concentrate it. I spent the budget in a few deliberate places and kept everything around them quiet.
        </p>
        <Decision label="// Decision — the hero" title="The hero as showstopper">
          <p>
            The hero section needed to be unforgettable. I embedded a full-screen Spline 3D experience—the shape blend tool let me create organic, flowing forms that animated as you interacted with the camera. GSAP orchestrated the reveal: the video scales from a small frame to full-screen as you scroll, the TV overlay fades, and you're left with an immersive moment.
          </p>
        </Decision>
        <Decision label="// Decision — interactivity" title="Interactivity as core, not nice-to-have">
          <p>
            Every transition serves a purpose. Scrolling down pushes the hero video to full screen. Moving to the next section reveals new content through choreographed animations. The "Our Work" section—originally a static grid in Figma—became an accordion that opens on hover. More interactivity. More color. More to discover.
          </p>
        </Decision>
        <Decision label="// Decision — pacing" title="Transition language">
          <p>
            I obsessed over pacing. The TV reveal transition, the Contact section animation—these aren't just smooth. They're <em>intentional</em>. The timing, the easing, the delay between elements—every millisecond builds the feeling that this experience was crafted, not templated.
          </p>
        </Decision>
        <MediaCompare size="wide">
          <VideoFigure
            src={`${ASSETS}/TV-transition.mp4`}
            caption="The TV reveal — the hero video scales to full-screen on scroll as the overlay fades."
          />
          <VideoFigure
            src={`${ASSETS}/ContactUs-Transition.mp4`}
            caption="The Contact transition — each section flows into the next to close the loop."
          />
        </MediaCompare>
      </CaseStudySection>

      <CaseStudySection index="05" title="Execution">
        <h3>Leading the team</h3>
        <p>
          I designed the complete system in Figma, then led a team of 8 through implementation. Each team member owned a case study—designing and coding their section.
        </p>
        <p>
          But distributed teams move at different speeds, and quality dipped. I stepped in: I designed and coded one complete case study myself, then built a universal component system to unify all 8.
        </p>
        <p>
          Every case study is assembled from the same four components and differs only by configuration—so a bold, minimalist design and an image-heavy one still share spacing, animation timing, and interaction patterns. No rewrites. Just props.
        </p>
        <SystemMap
          base={["CaseStudyHero", "CaseStudyHeader", "CaseStudyContent", "CaseStudyFooter"]}
          varies={[
            { name: "color", detail: "One palette per study, from the central CASE_STUDY_COLORS config" },
            { name: "content", detail: "Copy, images, and video passed in as props" },
            { name: "layout", detail: "Section order and image treatment per designer" },
            { name: "animation", detail: "Shared GSAP timings, opted into per section" },
          ]}
          outputs={[
            "Study 01",
            "Study 02",
            "Study 03",
            "Study 04",
            "Study 05",
            "Study 06",
            "Study 07",
            "Study 08",
          ]}
          caption="The component system — one shared skeleton, eight configurations. Colors shown are indicative of how each study takes its own palette from a single config."
        />

        <h3>Learning GSAP</h3>
        <p>
          The animations are built on GSAP—specifically, scroll-driven timelines with scrub. Learning animation libraries felt intimidating at first, but I invested time in understanding not just <em>how</em> to make things move, but <em>why</em> the pacing matters. An animation that feels slow kills momentum. One that feels jerky breaks immersion.
        </p>
        <p>
          I spent weeks tuning the transitions, testing scroll velocity, experimenting with easing curves. The TV hero reveal, the Contact section flow—these feel polished because I refused to settle for "it works."
        </p>

        <h3>Integrating Spline</h3>
        <p>
          Learning Spline felt less daunting because of my prior experience in Maya and Figma. The shape blend tool opened up possibilities: organic, flowing 3D forms that animate smoothly. The hero camera interaction—free movement, responsive—required Spline expertise plus React integration.
        </p>

        <h3>Shipping the admin tool</h3>
        <p>
          Sofia (new business lead) needed a way to generate tailored links in minutes, not hours of manual work. The admin panel lets her:
        </p>
        <ul>
          <li>Filter case studies by industry and service type</li>
          <li>Select which sections to include</li>
          <li>Generate a shareable link instantly</li>
        </ul>
        <p>
          The panel was implemented by the team's lead developer. The UX and information architecture are mine.
        </p>
      </CaseStudySection>

      <CaseStudySection index="06" title="The outcome">
        <p>
          <strong>8 polished case studies</strong> with a unified design system.
        </p>
        <p>
          <strong>A production-ready admin tool</strong> that reduced pitch creation time from hours (or days) to <strong>minutes</strong>. Sofia can now generate a tailored pitch link in under 5 minutes. What used to require customizing slides, pulling case studies, and rebuilding the narrative now takes a few clicks and a link share.
        </p>
        <p>
          <strong>An interactive web experience</strong> that doesn't feel like a proposal. It feels like proof. Prospects click a link and immediately see: premium interactions, sophisticated design, 3D, thoughtful transitions. Before they read a single case study, they <em>know</em> The Agency understands digital-first thinking.
        </p>

        <CtaLink href={LIVE_SITE}>See the live site — best on desktop</CtaLink>
      </CaseStudySection>

      <CaseStudySection index="07" title="What changed">
        <p>
          The case studies section evolved during development. In Figma, it was a static grid—straightforward, clean. But when we started building, something felt off. A grid of case studies is expected. Boring.
        </p>
        <p>
          I redesigned it as an accordion that opens on hover: progressive disclosure, more interactivity, more color revealed as you explore. It matched the energy of the hero and reinforced the theme—interactivity isn't a luxury, it's how you engage someone.
        </p>
        <MediaCompare size="bleed">
          <VideoFigure
            src={`${ASSETS}/oldGrid.mp4`}
            label="Before"
            caption="The original static grid — clean, but expected."
          />
          <VideoFigure
            src={`${ASSETS}/accordion.mp4`}
            label="After"
            caption="The hover accordion — progressive disclosure, more to discover."
          />
        </MediaCompare>
      </CaseStudySection>

      <CaseStudySection title="Learnings" plain>
        <LearningItem title="Animation pacing is craft.">
          <p>
            Every millisecond matters. The difference between a transition feeling premium and feeling jarring is often 100ms of easing or a delayed stagger.
          </p>
        </LearningItem>
        <LearningItem title="Leading distributed teams requires post-production refinement.">
          <p>
            You can't expect perfect execution on the first pass. But you <em>can</em> unify the output with smart systems (universal components, design tokens).
          </p>
        </LearningItem>
        <LearningItem title="3D on web isn't scary—it's an opportunity.">
          <p>
            Spline + React + GSAP opened doors. The hero interaction wouldn't be possible without 3D, and it's what makes people stop and engage.
          </p>
        </LearningItem>
        <LearningItem title="Interactivity is emotional.">
          <p>
            The accordion reveal, the TV scale, the hover states—these aren't decorative. They tell people "something alive is happening here." That matters in a pitch.
          </p>
        </LearningItem>
      </CaseStudySection>

      <CaseStudySection title="Next" plain>
        <p>
          Sofia can now pitch in minutes. The tool is production-ready, waiting whenever she needs it.
        </p>
        <p>
          Refinements for next time: mobile optimization on the hero, case study spacing consistency, one Spline scene clipping issue. These are known, manageable—and intentionally deprioritized in favor of focusing on the portfolio.
        </p>
        <p>
          Because here's what matters: <strong>The Agency now has a pitch system that feels like them.</strong>
        </p>
      </CaseStudySection>
    </CaseStudyLayout>
  );
}
