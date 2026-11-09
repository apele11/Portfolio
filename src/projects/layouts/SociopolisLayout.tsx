import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  Figure,
  VideoFigure,
  MediaCompare,
  ScopeBlock,
  PaperDiagram,
  PaperRow,
  PaperGroup,
  PaperBox,
  PaperGrid,
  PaperArrow,
  Outcome,
} from "../case-study";

/*
 * Sociopolis: a gamified intro-sociology web app, Intro to Software
 * Engineering, Fall 2025. Team of four: Emily, Tomas Martinez Anderson, Isabel
 * Hernandez, Vincent Lin.
 *
 * Sources, so every claim here can be re-checked:
 *   - Emily designed every screen (her Figma file) and drew Soci, the city and
 *     the houses in Illustrator, then animated Soci in After Effects and
 *     exported to Lottie. Her own account, 2026-11-09.
 *   - Code, from the team repo (Coding/WebApps/Sociopolis, remote
 *     isavic01/Sociopolis). Emily's commits: the global stylesheet and tokens
 *     (a14608d), landing city and house SVGs, nav assets, the Lottie walk cycle
 *     on the landing page (a0a4adc), and the 2026-09-01 move to Tailwind
 *     (51f88ef: 33 files, +702 / -1923). Teammates: auth, password reset and
 *     the character screen (Tomas), login, email verification, XP functions and
 *     a backend emulator with tests (Vincent), XP wiring, house buttons and the
 *     2025 lesson styling (Isabel). Backend work is not claimed.
 *   - Token values are read from the stylesheet before the Tailwind move
 *     (14422e3:FrontEnd/src/styles/tokens/*).
 *   - Lesson numbers are from FrontEnd/src/data/lessons/unit-1-lesson.json.
 *   - walk_cycle.json: 19 layers, 42 frames at 24 fps, 23 KB. The layer names
 *     end in "Outlines", which is what After Effects names shape layers made
 *     from Illustrator layers.
 *
 * Deliberately absent: the grade (100). It says the course was passed, not
 * what the product did. There was no user research, so the study says so in
 * its last band rather than implying any.
 *
 * Media was exported from Emily's Figma frames and rendered from the Lottie
 * file (headless Chrome + lottie-web, one screenshot per frame).
 */

const ASSETS = "/assets/compressed/Sociopolis";
const REPO = "https://github.com/isavic01/Sociopolis";

const MEDIA = {
  cityNight: `${ASSETS}/Sociopolis-City-Night.webp`,
  lightMode: `${ASSETS}/Sociopolis-Light-Mode.webp`,
  darkMode: `${ASSETS}/Sociopolis-Dark-Mode.webp`,
  walkCycle: `${ASSETS}/Soci-Walk-Cycle.mp4`,
  skins: `${ASSETS}/Soci-Skins.webp`,
  question: `${ASSETS}/Sociopolis-CheckIn-Question.webp`,
  feedback: `${ASSETS}/Sociopolis-CheckIn-Feedback.webp`,
};

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function SociopolisLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack} tone="cool">
      <CaseStudySection index="/01" label="About" title="A Sociology Course You Can Walk Around">
        <p>
          The brief for Intro to Software Engineering was a single line: build a gamified web app. Our team of
          four chose sociology and turned an intro course into a city. Each house is a lesson, a small character
          named Soci keeps you company, and every right answer earns XP toward a shared leaderboard.
        </p>
        <p>
          I designed all of it in Figma, from the landing city to the lesson screens. I drew Soci and the city in
          Illustrator, animated Soci in After Effects, and shipped the animation to the browser as Lottie. In the
          code, I built the global stylesheet and design tokens the pages were styled from.
        </p>
        <ScopeBlock
          team="Team of four, one semester. I designed every screen, and the four of us split the code."
          mine={[
            "Every screen, in Figma",
            "Soci, the city and the houses, in Illustrator",
            "Soci's walk cycle, in After Effects and Lottie",
            "The global stylesheet and design tokens",
            "The later move from Sass to Tailwind",
          ]}
          others={[
            "Sign-up, login, password reset and email verification (Tomas Martinez Anderson, Vincent Lin)",
            "XP, the leaderboard and the admin tools (Isabel Hernandez, Tomas, Vincent)",
            "The lesson screens in code, and the houses as buttons (Isabel)",
            "A backend emulator with tests (Vincent)",
          ]}
        />
      </CaseStudySection>

      <Figure
        src={MEDIA.cityNight}
        alt="Sociopolis at night: a row of houses and shops under a starry sky, with Soci, a round blue character, on the street and an XP counter in the top bar"
        label="Landing"
        caption="The landing city at night. Every house opens a lesson."
      />

      <CaseStudySection index="/02" label="Concept" title="The Map Is the Menu">
        <p>
          A list of lessons would have worked, but it would have looked like homework. In Sociopolis the
          navigation is a street. The houses are the lessons, the city is the course, and progress is a place you
          can see rather than a percentage. The how-to-play panel says it in one line: select a house in the city
          to start a lesson.
        </p>
        <p>
          The city also has a day and a night, and they are the app's light and dark modes. The menu and panels
          change with the sky, so switching themes feels like the evening coming in rather than a setting
          flipping.
        </p>
      </CaseStudySection>

      <MediaCompare>
        <Figure
          src={MEDIA.lightMode}
          alt="Light mode: the city in daylight with the side menu open, listing General, Profile, Leaderboard, Character and About"
          label="Day"
        />
        <Figure
          src={MEDIA.darkMode}
          alt="Dark mode: the city at night with the side menu and the customize panel open, showing Soci and a row of skin colors"
          label="Night"
        />
      </MediaCompare>

      <CaseStudySection index="/03" label="Soci" title="From Illustrator to the Browser">
        <p>
          Soci is on screen in every part of the app, so the character had to read at avatar size and still have
          a personality at full size. I drew Soci in Illustrator as a round shell with short arms, two feet and
          oversized eyes.
        </p>
        <p>
          For the animation, every part went into After Effects as its own layer. The finished file has nineteen
          of them: an inner and an outer shell, two arms, two feet, a mouth in three pieces, and each eye built
          from a white, an iris, a pupil, a highlight and a small specular dot. Keeping the parts separate is what
          lets the body bob while the feet step and the arms swing on their own timing.
        </p>
        <p>
          The walk is 42 frames at 24 frames per second, a loop of under two seconds. Exported to Lottie, it
          reaches the browser as vector data instead of video, so it stays sharp at any size, and the whole loop
          is 23 KB, smaller than a single still image of Soci. On the landing page it plays through a Lottie web
          component that I wired in.
        </p>
        {/* Column width, not the full measure: at 952px the character was
            bigger than anything else on the page. */}
        <VideoFigure
          src={MEDIA.walkCycle}
          label="Walk cycle"
          caption="Soci's walk cycle, rendered from the Lottie file that ships in the app."
        />
      </CaseStudySection>

      <Band>
        <h2>Six Skins, One Character</h2>
        <p>
          Players can make Soci their own. I designed six skins and the customize panel that offers them, and
          Tomas built the screen that switches between them. Each skin keeps the same shading, so a dark navy Soci
          and a butter yellow one still read as the same character.
        </p>
        <Figure
          src={MEDIA.skins}
          alt="Soci in six colors side by side: light blue, dark navy, green, butter yellow, orange and pink"
          label="Skins"
        />
      </Band>

      <CaseStudySection index="/04" label="Lessons" title="Small Questions, Instant Answers">
        <p>
          A lesson is read in short sections, and the questions sit inside them instead of waiting at the end.
          Unit 1, "Why People Do What They Do," has five sections, seven check-ins and ten vocabulary terms. Each
          check-in asks one question with four answers.
        </p>
        <p>
          Whatever you pick, the answer comes back straight away with the reason. A right answer gets a green bar
          that restates the idea and earns ten XP. A wrong one explains the concept instead of just marking it
          wrong, so either way the question teaches something.
        </p>
      </CaseStudySection>

      <MediaCompare>
        <Figure
          src={MEDIA.question}
          alt="A check-in question: 'People in Japan often eat together and use chopsticks. This is an example of?' with an illustration of a family meal and four answer buttons"
          label="Question"
        />
        <Figure
          src={MEDIA.feedback}
          alt="The same question answered: 'culture' is selected and a green bar reads 'Right! Culture means the shared way of life. Including food, customs, and traditions.'"
          label="Answered"
        />
      </MediaCompare>

      <PaperDiagram
        summary="Read → answer → feedback → XP"
        caption="The loop inside every lesson. The feedback explains the idea whichever answer you chose."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · Read">
            <PaperBox title="A short section">One idea at a time, such as culture and norms.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="02 · Answer">
            <PaperBox title="One check-in">A single question with four options.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="03 · Learn">
            <PaperBox title="Feedback">Right or wrong, the reason comes back at once.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="04 · Earn">
            <PaperBox title="XP" tint>
              Ten per right answer, counted toward the leaderboard.
            </PaperBox>
          </PaperGroup>
        </PaperRow>
      </PaperDiagram>

      <CaseStudySection index="/05" label="System" title="Tokens Before Pages">
        <p>
          Early in the build I set up the global stylesheet the team styled from: tokens for color, type, motion
          and layering, plus mixins for the patterns that repeat. With four people writing pages at once, named
          values were what kept the screens looking like one app.
        </p>
      </CaseStudySection>

      <PaperDiagram caption="The token set the pages were styled from.">
        <PaperGrid>
          <PaperBox title="Color">
            A tonal palette with every color in nineteen steps, from 5 to 95, plus named roles for surfaces,
            progress, focus, success and warning.
          </PaperBox>
          <PaperBox title="Type">
            Montserrat Alternates for display text and labels, Montserrat for everything else, and tabular figures
            on labels so changing numbers hold their width.
          </PaperBox>
          <PaperBox title="Motion">
            Three durations, 150, 250 and 400 milliseconds, and four easing curves, so every transition shares one
            feel.
          </PaperBox>
          <PaperBox title="Layers">
            Named stacking levels from base to modal, so overlays stack the same way on every page.
          </PaperBox>
        </PaperGrid>
      </PaperDiagram>

      <Band>
        <h2>Rebuilt on Tailwind</h2>
        <p>
          After the course ended, I moved the front end from Sass to Tailwind. The change touched 33 files and
          left about 1,200 fewer lines of styling behind, which makes the project far easier for the next
          contributor to pick up.
        </p>
      </Band>

      <Band>
        <h2>What I Would Do Next</h2>
        <p>
          We shipped without testing Sociopolis on learners. The next step is putting the lesson loop in front of
          students: whether the feedback lands, whether the city reads as navigation on a first visit, and
          whether XP is enough to bring anyone back for Unit 2.
        </p>
      </Band>

      <Outcome label="Outcome" href={REPO} cta="See the code">
        A working intro sociology unit set inside a city, designed end to end and built by four people in one
        semester.
      </Outcome>
    </CaseStudyLayout>
  );
}
