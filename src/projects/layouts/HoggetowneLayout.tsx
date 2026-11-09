import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  Figure,
  ScrollFigure,
  MediaGroup,
  MediaCompare,
  PhoneRow,
  PhoneShowcase,
  PaperDiagram,
  PaperGrid,
  PaperBox,
  PaperNote,
  ScopeBlock,
  PhonePrototype,
  Outcome,
} from "../case-study";
import type { PhoneScreen, PrototypeFlow } from "../case-study";

/*
 * Hoggetowne Medieval Faire: a companion app proposal for the City of
 * Gainesville's renaissance faire, CEN4722 (UX), Fall 2026. Team of five, the
 * "Solution Imagineers": Emily Apel, Emir Erkilic, Shelton Joseph, Amilcar
 * Suarez, Alyssa Zielinski.
 *
 * Sources, so every claim here can be re-checked:
 *   - Design Document, Milestone 3 (SCHOOL/UX-Class/groupProject). Research
 *     numbers (161 notes, 31 low-level and 8 high-level themes, 8 needs), the
 *     "surprised us" list, the idea counts (34 team + 15 added = 49, merged to
 *     13) and the three tasks all come from it. The P3 turkey-leg quote is
 *     note 77.
 *   - The hi-fi screens and prototype are Emily's Figma file
 *     DpNgMrX5Z28AJuWkE30aFF, page "Redesign" (18:518). The concept copy in the
 *     Design section paraphrases the hidden "Concept note" frame (30:1532) on
 *     that page. Screens were exported at 2x from the three task sections.
 *   - Emily's own account of her role (2026-11-09): the hi-fi screens and
 *     prototype, research sessions, and the task, system and screen flows are
 *     hers; the affinity diagram, brainstorms and dot voting were shared.
 *
 * Deliberately absent: the stakeholder's name and the persona stock photos.
 * Personas are composites with fictional names, so they appear only as names
 * attached to tasks.
 */

const ASSETS = "/assets/compressed/Hoggetowne";

const FIGMA_PROTOTYPE =
  "https://www.figma.com/proto/DpNgMrX5Z28AJuWkE30aFF/Hoggetowne-Medieval-Faire-%E2%80%93-Mobile-App-Proposal?node-id=24-437&p=f&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=24%3A437&show-proto-sidebar=1&page-id=18%3A518";
/* One embed per flow start. Figma's UI is hidden and the frame is rendered at its own 390x844, so
   the prototype fills the phone in PhonePrototype; see that component for why. Node ids are the
   page's flow starting points. */
const flowEmbed = (nodeId: string) =>
  `https://embed.figma.com/proto/DpNgMrX5Z28AJuWkE30aFF/Hoggetowne-Medieval-Faire-%E2%80%93-Mobile-App-Proposal?node-id=${nodeId.replace(":", "-")}&page-id=18%3A518&starting-point-node-id=${encodeURIComponent(nodeId)}&scaling=scale-down-width&content-scaling=fixed&hide-ui=1&embed-host=share`;

const PROTOTYPE_FLOWS: PrototypeFlow[] = [
  { label: "Attendee", src: flowEmbed("24:437"), darkSrc: flowEmbed("29:1106") },
  { label: "Volunteer", src: flowEmbed("28:790"), darkSrc: flowEmbed("29:1328") },
  { label: "Director", src: flowEmbed("29:885"), darkSrc: flowEmbed("29:1429") },
];

const screen = (name: string) => `${ASSETS}/Hogg-${name}.webp`;

/* Task 1, the main task, in prototype order. */
const ROUTE_SCREENS: PhoneScreen[] = [
  {
    src: screen("Home"),
    label: "Home",
    caption: "Home leads with what changed overnight: the mud.",
  },
  {
    src: screen("Map"),
    label: "Map",
    caption: "Accessible paths are a layer on the live map.",
  },
  {
    src: screen("Search"),
    label: "Search",
    caption: "Results are sorted by distance and say how you get there.",
  },
  {
    src: screen("Place"),
    label: "Place",
    caption: "Access notes sit beside the hours, not under a tab.",
  },
  {
    src: screen("RouteOptions"),
    label: "Route options",
    caption: "Accessible and dry is the first choice offered.",
  },
  {
    src: screen("RoutePreview"),
    label: "Preview",
    caption: "The preview names what is on the way.",
  },
  {
    src: screen("TurnByTurn"),
    label: "Turn by turn",
    caption: "The map is saved, so the route survives a lost signal.",
  },
  {
    src: screen("Arrived"),
    label: "Arrived",
    caption: "Arrival hands you the next thing worth doing.",
  },
];

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function HoggetowneLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <PhoneRow columns={4} bezel>
        <Figure src={screen("Home")} alt="Attendee home screen" caption="Attendee home" />
        <Figure src={screen("RouteOptions")} alt="Route options screen" caption="Choosing a dry route" />
        <Figure src={screen("TurnByTurn")} alt="Turn-by-turn navigation screen" caption="Turn by turn" />
        <Figure src={screen("AlertDetail")} alt="Urgent storm alert screen" caption="A director's alert" />
      </PhoneRow>

      <CaseStudySection index="/01" label="About" title="A Faire App Built on How People Walk It">
        <p>
          The Hoggetowne Medieval Faire is the City of Gainesville's yearly renaissance faire, and in 2027 it
          moves to Gainesville Raceway. Our team of five was asked to design a digital companion for it. We
          proposed a mobile app for three people: the attendee finding their way, the volunteer starting a
          shift, and the director who has to reach everyone at once.
        </p>
        <ScopeBlock
          team="Team of five, one semester. I designed the app and built the prototype."
          mine={[
            "Every high-fidelity screen, in light and dark",
            "The clickable Figma prototype",
            "The task, system and screen flows",
            "Research sessions, leading and taking notes",
          ]}
          others={[
            "Recruiting attendee participants (Alyssa Zielinski)",
            "The affinity diagram, brainstorms and dot voting, shared by all five",
          ]}
        />
      </CaseStudySection>

      <CaseStudySection index="/02" label="Research" title="161 Notes, Eight Needs">
        <p>
          We interviewed the faire's director and past attendees and volunteers, then watched three fairgoers
          find their way around comparable local events. Every quote and observation became a sticky note, and
          we grouped them from the bottom up until eight themes were left. Each theme became a user need.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <Figure
          src={`${ASSETS}/Hogg-RawData.webp`}
          alt="A wall of 161 colored sticky notes, one color per participant"
          label="Raw data · 161 notes"
          caption="Every note from six participants, colored by who said it."
        />
        <ScrollFigure
          src={`${ASSETS}/Hogg-Affinity.webp`}
          alt="The affinity diagram: eight themed boards of grouped sticky notes, from Finding Your Way to Planners Building the Faire by Hand"
          label="Affinity diagram · 31 groups, 8 themes"
          caption="Scroll the board. Each theme closes with the user need it produced."
          ratio={952 / 700}
        />
      </MediaGroup>

      <PaperDiagram
        summary="Four findings that changed the brief"
        caption="What the data overturned. Our first plan put the map, ADA routing and parking at the center."
      >
        <PaperGrid>
          <PaperBox title="Nobody reads the map" tint>
            People walk the grounds and ask staff. The paper map is skipped, or read for its sections only.
          </PaperBox>
          <PaperBox title="Food came up unprompted">
            Three sessions raised diets, long lines and sell-outs, although none of our questions asked.
          </PaperBox>
          <PaperBox title="Parking is really traffic">
            The Raceway has room to park. The worry is every car arriving through one lot.
          </PaperBox>
          <PaperBox title="The intercom is going away" tint>
            The director's largest risk is reaching every volunteer once the old PA system is gone.
          </PaperBox>
        </PaperGrid>
        <PaperNote center>
          "I look for somebody with a turkey leg and ask them where the booth is. It's easier than looking at
          the map." (Participant 3)
        </PaperNote>
      </PaperDiagram>

      <CaseStudySection index="/03" label="Ideation" title="49 Ideas, Three Tasks">
        <p>
          We wrote a persona for each role and ran a timed brainstorm for each one. Grouping and dot voting
          took 49 ideas down to 13, and those came down to the three tasks the app had to do best.
        </p>
      </CaseStudySection>

      <MediaCompare>
        <Figure
          src={`${ASSETS}/Hogg-Brainstorm.webp`}
          alt="Brainstorm board for the attendee persona, a grid of idea stickies"
          label="Brainstorm"
        />
        <Figure
          src={`${ASSETS}/Hogg-DotVote.webp`}
          alt="The attendee ideas grouped into six columns with colored voting dots on the merged ideas"
          label="Grouped and dot-voted"
        />
      </MediaCompare>

      <PaperDiagram
        summary="Three personas → three tasks"
        caption="One task per role. The first is the main task."
      >
        <PaperGrid>
          <PaperBox title="Riley · attendee" tint>
            Find a booth and follow an accessible, dry route to it.
          </PaperBox>
          <PaperBox title="Jordan · volunteer">Get to the meet-up point and check in for a shift.</PaperBox>
          <PaperBox title="Dana · director">Send a real-time alert to attendees and volunteers.</PaperBox>
        </PaperGrid>
      </PaperDiagram>

      <CaseStudySection index="/04" label="Flows" title="Mapped Before Drawn">
        <p>
          Each task became a flow with its decisions and failure paths, such as no search results, no
          accessible route, or a lost signal. A system flow then showed where the roles meet. A volunteer
          walking to the meet-up uses the same route screens as an attendee walking to lunch.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <Figure
          src={`${ASSETS}/Hogg-SystemFlow.webp`}
          alt="System flow with lanes for director, attendee, shared screens and volunteer, showing how the three tasks connect"
          label="System flow"
          caption="Three roles, one app. The teal lane holds the screens they share."
        />
        <MediaCompare>
          <Figure
            src={`${ASSETS}/Hogg-TaskFlow.webp`}
            alt="Task flow for finding a booth, with decision diamonds for place found, route available and still on route"
            label="Task flow"
          />
          <Figure
            src={`${ASSETS}/Hogg-ScreenFlow.webp`}
            alt="Screen flow from attendee home to arrival, with alternate screens for no matches, no accessible route and lost signal"
            label="Screen flow"
          />
        </MediaCompare>
        <Figure
          src={`${ASSETS}/Hogg-Storyboard-Route.webp`}
          alt="Five-panel storyboard: Riley at the gate, picturing the route, checking the preview, walking around the mud, and reaching the turkey leg stand"
          label="Storyboard"
          caption="Riley reaches the turkey leg stand on a dry path, before they sell out."
        />
      </MediaGroup>

      <CaseStudySection index="/05" label="Design" title="Wayfinding as Type">
        <p>
          Fairgoers glance at the app while they walk, so each screen has one job and one clear action. Type
          and hairlines carry the structure instead of cards, and there is a single accent. Green always means
          the route.
        </p>
      </CaseStudySection>

      <PhoneShowcase screens={ROUTE_SCREENS} bezel>
        <h2>The Main Task</h2>
        <p>
          Accessible and dry is offered first rather than hidden in a filter. It keeps to paved paths, names
          the bench on the way, and keeps working from the saved map when the signal drops.
        </p>
      </PhoneShowcase>

      <Band>
        <h2>The Same System for Staff</h2>
        <p>
          The volunteer and the director get the same rows, type and buttons. A volunteer acknowledges a moved
          meet-up, walks there with the shared route screens, and checks in with a QR code.
        </p>
      </Band>

      {/* The rows sit outside the bands on purpose. Four phones across the band's 708px came out about
          150px wide, too small to read a screen. */}
      <PhoneRow columns={4} bezel>
        <Figure src={screen("VolHome")} alt="Volunteer home with a shift update" caption="Shift update" />
        <Figure
          src={screen("ShiftDetails")}
          alt="Shift details with the meet-up point"
          caption="Shift details"
        />
        <Figure src={screen("CheckIn")} alt="QR code scanner" caption="QR check-in" />
        <Figure src={screen("CheckedIn")} alt="Checked in, with a pre-shift checklist" caption="Checked in" />
      </PhoneRow>

      <Band>
        <p>
          The director picks a template, chooses who hears it, and sends. Attendees get the alert with the
          shelter marked on the map.
        </p>
      </Band>

      <PhoneRow columns={3} bezel>
        <Figure src={screen("AlertCenter")} alt="Alert Center with templates" caption="Alert Center" />
        <Figure src={screen("ComposeAlert")} alt="Composing an urgent weather alert" caption="Compose" />
        <Figure
          src={screen("AlertDetail")}
          alt="The storm alert as an attendee sees it"
          caption="What attendees see"
        />
      </PhoneRow>

      <Band>
        <h2>Light and Dark From One Source</h2>
        <p>
          Both themes run from one variable collection, so the app reads in full sun at noon and while vendors
          pack up after dark.
        </p>
      </Band>

      <PhoneRow columns={4} bezel>
        <Figure src={screen("Home")} alt="Home, light theme" caption="Light" />
        <Figure src={screen("Dark-Home")} alt="Home, dark theme" caption="Dark" />
        <Figure src={screen("RoutePreview")} alt="Route preview, light theme" caption="Light" />
        <Figure src={screen("Dark-RoutePreview")} alt="Route preview, dark theme" caption="Dark" />
      </PhoneRow>

      <CaseStudySection index="/06" label="Prototype" title="Try It">
        <p>The prototype covers all three tasks, in light and in dark.</p>
      </CaseStudySection>

      <PhonePrototype
        flows={PROTOTYPE_FLOWS}
        title="Hoggetowne Medieval Faire prototype"
        poster={screen("Home")}
        href={FIGMA_PROTOTYPE}
        caption="Tap through it like the app."
      >
        <h2>Find a Turkey Leg</h2>
        <p>
          Start as Riley at the attendee home. Search for the turkey leg stand, choose the accessible and dry
          route, and follow it to the end.
        </p>
        <p>
          The buttons under the phone switch to the volunteer and director flows, and the last one swaps the
          theme.
        </p>
      </PhonePrototype>

      <Band>
        <h2>What We Would Test Next</h2>
        <p>
          The gaps are clear. We have not yet heard from vendors or from anyone who uses a mobility aid, and
          no one knows the Raceway's paths or cell coverage. The accessible route is the feature that most
          needs those answers, so it is the first thing we would put in front of real users.
        </p>
      </Band>

      <Outcome label="Outcome" href={FIGMA_PROTOTYPE} cta="Open the prototype">
        A researched, clickable companion app for a faire on new ground, built from 161 notes about how people
        actually find their way.
      </Outcome>
    </CaseStudyLayout>
  );
}
