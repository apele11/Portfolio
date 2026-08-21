import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  Steps,
  Figure,
  VideoFigure,
  MediaGroup,
  MediaCompare,
  PhoneRow,
  PhoneShowcase,
  PaperDiagram,
  PaperRow,
  PaperGroup,
  PaperBox,
  PaperGrid,
  PaperArrow,
  PaperTurn,
  PaperNote,
  Embed,
  Outcome,
} from "../case-study";

const ASSETS = "/assets/compressed/LockedIn";

const FIGMA_WIREFRAMES =
  "https://www.figma.com/design/ICezDX54AaIJOqftzLCIWp/LockedIn?node-id=0-1&t=xQ7tPBBTaXE6YyPz-1";
const FIGMA_PROTOTYPE =
  "https://www.figma.com/proto/ICezDX54AaIJOqftzLCIWp/LockedIn?node-id=103-1480&p=f&viewport=648%2C156%2C0.17&t=9MHiVriYwpW1IY1T-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=103%3A1480&show-proto-sidebar=1&page-id=30%3A439";
const FIGMA_EMBED =
  "https://embed.figma.com/proto/ICezDX54AaIJOqftzLCIWp/LockedIn?node-id=103-1480&p=f&scaling=scale-down&content-scaling=fixed&page-id=30%3A439&starting-point-node-id=103%3A1480&show-proto-sidebar=1&embed-host=share";

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function LockedInProjectLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <CaseStudySection index="/01" label="About">
        <p>
          <strong>LockedIn</strong> is a mobile study-space finder for the University of Florida. It pulls campus
          libraries and nearby Gainesville cafés into one map, filtered by the things that actually decide where a
          student sits down — how loud it is, how full it is, whether there are outlets, whether a group can fit.
        </p>
        <p>
          Finding somewhere to study at UF means guessing. The information is scattered across library sites, apps
          that only report occupancy, and word of mouth, and none of it is current, so students walk to a library to
          find out whether the library is worth walking to. LockedIn answers that question before the walk, then gives
          them a reason to keep using it: reserve the room, run the session, earn Gator Points for finishing it.
        </p>
        <p>
          A six-person team over one semester. I owned the wireframes and carried the prototype through to its final
          state, ran an interview and took notes through user testing, helped manage the project, and built this
          portfolio page. The work is a Figma prototype, not a shipped app.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <PhoneRow columns={4}>
          <VideoFigure src={`${ASSETS}/MAP-HOME.mp4`} caption="Map — what's open, and how full" />
          <VideoFigure src={`${ASSETS}/MAP-FILTER.mp4`} caption="Filters — noise, crowding, amenities" />
          <VideoFigure src={`${ASSETS}/CALENDAR-LOCKIN.mp4`} caption="Locking in — the session timer" />
          <VideoFigure src={`${ASSETS}/PROFILE.mp4`} caption="Profile — points, streaks, history" />
        </PhoneRow>
      </MediaGroup>

      <CaseStudySection index="/02" label="Research" title="What 29 Students Told Us">
        <p>
          We ran a 20-question survey with 29 respondents and three long-form interviews with on-campus students from
          different majors. The survey was built to challenge our assumptions rather than confirm them — most of all
          the assumption underneath the whole idea, that a student shown a better space would actually move to it.
          Habit, routine, and a favourite chair turned out to be real forces, and the answer shaped what we built:
          the app has to be worth the walk, not just informative about it.
        </p>
        <p>
          Three findings did most of the work. Quiet beats everything, so noise had to be first-class data rather than
          a review someone left last year. Nearly half study in groups, so booking a room had to handle more than one
          person. And half study at home by default — which is why the app has to offer something home does not, from
          promotions at local cafés to points for a session you finished.
        </p>
      </CaseStudySection>

      <PaperDiagram
        dense
        summary="A survey of 29 and three interviews → the three findings that set the feature list"
        caption="Survey findings — what the numbers changed about the design."
      >
        <PaperGroup label="29 survey responses · 3 interviews">
          <PaperGrid>
            <PaperBox title="72% want quiet" tint>
              Prioritized silent spaces or spaces with few people — so noise became data, not a review.
            </PaperBox>
            <PaperBox title="45% study in groups" tint>
              Booking had to work for a table of five, not just a desk for one.
            </PaperBox>
            <PaperBox title="55% study at home" tint>
              The app has to give them a reason to leave — promotions, points, a place already held.
            </PaperBox>
          </PaperGrid>
        </PaperGroup>

        <PaperTurn />

        <PaperNote center>
          the interviews said the same thing in words — "look for noise levels when checking study locations", and
          "I would want to know if a study spot allows snacks and drinks before going there"
        </PaperNote>
      </PaperDiagram>

      <Band>
        <h2>Who Else Is In This Market</h2>
        <p>
          We benchmarked the four tools UF students already reach for. Each one is good at something — live occupancy,
          map handling, favourites, streaks — and every one of them is missing the thing our survey put first. None
          reports noise. None combines campus-specific study conditions with filtering flexible enough to answer
          "quiet, near me, room for four, open until midnight."
        </p>
        <p>
          That gap is narrow on purpose, and it is the whole opportunity. A general discovery tool can show you a
          building. It cannot tell you whether you will be able to think inside it.
        </p>
      </Band>

      <PaperDiagram
        dense
        summary="Four existing tools → each strong somewhere, none reporting noise → the space LockedIn is built into"
        caption="Competitor analysis — where the four tools stop."
      >
        <PaperGroup label="What students use today">
          <PaperGrid>
            <PaperBox title="Waitz University">Live occupancy and a good map. No noise, no favourites.</PaperBox>
            <PaperBox title="Nook">Amenities and favourites, one city at a time. Occupancy is patchy.</PaperBox>
            <PaperBox title="Muggerino">The only one gamifying study. Sign-in required, select campuses.</PaperBox>
            <PaperBox title="Study Space">Campus-scoped and simple — but scoped to UT Dallas.</PaperBox>
          </PaperGrid>
        </PaperGroup>

        <PaperTurn />

        <PaperNote center>
          not one of the four reports noise level — the single thing 72% of students said they choose on
        </PaperNote>

        <PaperGrid>
          <PaperBox title="LockedIn" tint>
            Noise and crowding together, filtered, on campus, with a reason to come back.
          </PaperBox>
        </PaperGrid>
      </PaperDiagram>

      <CaseStudySection index="/03" label="Experience" title="Four Moves, One Loop">
        <p>
          The app is built as a loop rather than a search tool. Search ends when you find the thing; a study app that
          ends there gets opened once a week. So the flow runs find → choose → lock in → and back, with the session
          you just finished feeding the next one: points earned, a spot favourited, a room your group already knows
          how to book.
        </p>
        <p>
          Personas from the interviews kept us honest about who is walking it. Arlyn needs quiet with the option of
          company and no setup friction. Sophie needs to compare options fast without wading through a cluttered
          interface. Both fail at the same place — the moment where a tool makes you work to find out what a room is
          actually like.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Find a space near you → check noise and crowding → reserve it and start the timer → earn points, and go again"
        caption="The study loop — four moves, and the last one feeds the first."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · Find">
            <PaperBox title="What's near you">Campus libraries and local cafés on one map.</PaperBox>
            <PaperBox title="What's open">Hours, parking, and how to get there.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · Choose">
            <PaperBox title="Filter to your conditions">Noise, crowding, amenities, group size.</PaperBox>
            <PaperBox title="Check before you walk">Floor plans, popular times, what's inside.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · Lock in">
            <PaperBox title="Reserve and start">A room for one or five, and a timer that runs the session.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="04 · Come back">
            <PaperBox title="Points for finishing" tint>
              Gator Points, streaks, and the spot saved for next time.
            </PaperBox>
          </PaperGroup>
        </PaperRow>

        <PaperNote center>
          the loop closes on itself — what you earn and save in step four is what makes step one faster next week
        </PaperNote>
      </PaperDiagram>

      <Figure
        src={`${ASSETS}/user_scenario.webp`}
        alt="User scenario storyboard — a group of students finding, choosing, and booking a study space"
        caption="The group scenario we designed against — how students search, how a local business gets seen, and where the gamification lands."
      />

      <PhoneShowcase
        screens={[
          {
            src: `${ASSETS}/MAP-HOME.mp4`,
            label: "The map at rest",
            caption: "Noise and crowding on every pin, before you commit to the walk.",
          },
          {
            src: `${ASSETS}/MAP-FILTER.mp4`,
            label: "Filtering in place",
            caption: "The same map narrows — nothing navigates away.",
          },
        ]}
      >
        <h2>Deciding Before You Walk</h2>
        <p>
          The map opens on what is around you, and every pin carries the two things the survey said students choose
          on: how loud it is and how full it is. The filters narrow the same map rather than sending you to a results
          page — noise level, occupancy, group size, amenities — so the answer stays in the place you asked the
          question.
        </p>
      </PhoneShowcase>

      <PhoneShowcase
        screens={[
          {
            src: `${ASSETS}/CALENDAR-SCHEDULE.mp4`,
            label: "Scheduling",
            caption: "A room, a block, and a group who can all see it.",
          },
          {
            src: `${ASSETS}/CALENDAR-LOCKIN.mp4`,
            label: "Locked in",
            caption: "The session timer running against the booking.",
          },
        ]}
      >
        <h2>Booking a Room, Then Actually Using It</h2>
        <p>
          Reserving is where the group half of the research landed: rooms book in one- and two-hour blocks, and a
          shared calendar means a session gets scheduled once rather than negotiated in a group chat. Starting the
          session hands the app over to a timer — check in, study, get told when the time is nearly up.
        </p>
      </PhoneShowcase>

      <PhoneShowcase
        screens={[
          {
            src: `${ASSETS}/HOME-POPULAR.mp4`,
            label: "Home",
            caption: "Popular spots, and promotions from the cafés that gain the foot traffic.",
          },
          {
            src: `${ASSETS}/PROFILE.mp4`,
            label: "Profile",
            caption: "Gator Points, streaks, and where the work actually got done.",
          },
        ]}
      >
        <h2>A Reason to Leave the Apartment</h2>
        <p>
          Half our respondents study at home, and no amount of map quality changes that on its own. So the home page
          carries promotions from local cafés — the businesses that gain foot traffic from the app in the first place
          — and the profile keeps the count: Gator Points for completed sessions, streaks, badges, and the history of
          where the work actually got done.
        </p>
      </PhoneShowcase>

      <CaseStudySection index="/04" label="Process" title="From Affinity Map to Prototype">
        <p>
          Synthesis turned the survey and interviews into five requirement clusters, and those clusters are what the
          screens were drawn against — a check on every feature we wanted to add, rather than a list we wrote
          afterwards to justify it.
        </p>
        <Steps>
          <li>
            <strong>Location insight</strong> — noise level, crowding, floor plans, popular times, and operating hours
            on every space.
          </li>
          <li>
            <strong>Search and discovery</strong> — a popular-spots tab, quick jumps to favourites, libraries, quiet
            rooms and food, and filters over all of it.
          </li>
          <li>
            <strong>Booking and reservations</strong> — rooms in one- to two-hour blocks, solo or group, with a shared
            calendar and an in-app session timer.
          </li>
          <li>
            <strong>Engagement</strong> — user-reported noise and crowd updates, Pomodoro sessions, Gator Points,
            badges, and the LockedIn pet.
          </li>
          <li>
            <strong>Profiles</strong> — points and streaks, saved spots, and full session history.
          </li>
        </Steps>
        <p>
          Wireframing is where the flow changed. We had drawn the app around its primary actions and it stopped
          short — the user found a space and the screen had nowhere to send them. Adding a check-in page gave the
          flow a destination, and everything upstream of it started to read as one journey instead of a set of
          features sharing a nav bar.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <MediaCompare>
          <Figure src={`${ASSETS}/WIREFRAME-MAP.webp`} alt="Map view wireframes" label="Map" />
          <Figure src={`${ASSETS}/WIREFRAME-PROFILE.webp`} alt="Home and profile wireframes" label="Home & profile" />
        </MediaCompare>
        <MediaCompare>
          <Figure src={`${ASSETS}/WIREFRAME-LOGIN.webp`} alt="Login and onboarding wireframes" label="Login" />
          <Figure src={`${ASSETS}/WIREFRAME-CALENDAR.webp`} alt="Calendar and booking wireframes" label="Calendar" />
        </MediaCompare>
        <Figure
          src={`${ASSETS}/task-flow.webp`}
          alt="Task flow diagram covering onboarding, discovery, booking, and profile"
          caption="The task flow the wireframes were checked against — onboarding through discovery, booking, and back to the profile."
        />
      </MediaGroup>

      <Band>
        <h2>The Prototype</h2>
        <p>
          The final Figma prototype runs the loop end to end: search and filter, book a room, run a session, and watch
          the profile fill up. The map filters were the hard part — a working filter in Figma is boolean logic and
          variant swapping rather than design, and it took several rebuilds before the states held together.
        </p>
        <Embed
          src={FIGMA_EMBED}
          title="LockedIn Figma prototype"
          ratio={72}
          href={FIGMA_PROTOTYPE}
          caption="Interactive — start at the map."
        />
      </Band>

      <Outcome label="Outcome" href={FIGMA_WIREFRAMES} cta="See the Figma file">
        A researched, fully interactive prototype for a study-space finder — 29 survey responses and three interviews
        turned into one loop a UF student would actually reopen on Monday.
      </Outcome>
    </CaseStudyLayout>
  );
}
