import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  DeckSlides,
  Embed,
  MediaGroup,
  PaperDiagram,
  PaperBox,
  PaperGrid,
  Outcome,
} from "../case-study";
import type { DeckSlide } from "../case-study";

/*
 * Twix Awards — "Pass the Twix" / World ChocoCup, New Bloods 2026.
 *
 * Everything asserted about the game was read off the Unity project at
 * Coding/Unity/TWIX_TAKE2 (Assets/Scripts/*, Assets/Textures, Assets/Resources)
 * rather than recalled: KickTimer for the ring and its four results, BallKicker
 * for the animation-first delay and the three force bands, BallReceiver and
 * CameraController for the corner → follow → goal sequence, CurvedPlane for the
 * procedural stadium, SpriteSheetPlayer plus the 84 files in Resources/Frames
 * for the goal celebration. Everything about the campaign was read off the nine
 * slides of the submitted deck, which are the slideshow below.
 *
 * Deliberately not quoted: the tuned float values (ring duration, the two
 * tolerance bands, the kick forces, the delay). They are public serialized
 * fields, so the numbers in the scene can differ from the defaults in the
 * source, and a case study that cites a number it cannot see is worse than one
 * that describes the structure. The structure — four outcomes, three force
 * bands, two tolerance zones — is in the code and is safe as written.
 *
 * This study closes on an OUTCOME with a live CTA because the build is public.
 * The award result is not here because it was not known when this was written;
 * if it places, that belongs in the Outcome line.
 *
 * Media: the nine deck slides come from "Twix Slides.pdf", rendered at 3x
 * (5760x3240) so the type is resolved off the vectors rather than off a 1080p
 * raster, then downsampled to the two sizes each surface needs:
 *
 *   deck-NN.webp       1800px q88   the carousel, all nine loaded up front
 *   deck-NN-full.webp  2560px q92   the full-size view, one fetched on tap
 *
 * The first pass rendered at 1920 and let the compressor take it to 1800 at
 * q86, which put a non-integer downscale and a lossy pass over small type and
 * visibly mushed it. Both files are written as WebP straight into the drop
 * zone, which `npm run assets` moves through untouched (see MOVE_AS_IS), so
 * re-running it will not re-encode them. Regenerate from the PDF, not from
 * these.
 *
 * There is no capture of the game itself yet, because the live embed is doing
 * that job. If one is ever wanted, a clip of a Perfect pass into a goal would
 * sit well under /03.
 */

const ASSETS = "/assets/compressed/TwixGame";

/**
 * The submitted build. It leads the study and is linked again from the close.
 *
 * The `poster` on that Embed is load-bearing, not decoration. The Unity WebGL
 * build is about 44MB over the wire once Netlify has compressed it (33MB of
 * .data, 10MB of .wasm), and a mounted iframe fetches all of it on page load.
 * At the top of the page that is a 44MB download and a second WebGL context
 * spun up behind the hero shader before the reader has read a word. The poster
 * keeps the game first without any of that: the still is 123KB, and the build
 * is fetched only when somebody presses play. Do not drop it to "just show the
 * game".
 */
const GAME_URL = "https://twix-newblood-award.netlify.app/";

/** One slide, in both sizes. `n` is the zero-padded page number. */
const slide = (n: string, alt: string, hold?: number): DeckSlide => ({
  src: `${ASSETS}/deck-${n}.webp`,
  full: `${ASSETS}/deck-${n}-full.webp`,
  alt,
  hold,
});

/**
 * The nine slides of the submission, in the order they were presented.
 *
 * `hold` is set only where a slide is not carrying a paragraph. This deck is
 * bimodal: four of the nine are statements of three to ten words, and the rest
 * are a headline over a block of body copy. One interval that clears the
 * wordiest slide leaves the title cards sitting there long after they have been
 * read, and one that suits the title cards makes the rest unreadable. The
 * slides without a `hold` take the deck's default.
 */
const DECK: DeckSlide[] = [
  slide("01", "Title slide: Pass the Twix, set over a soccer ball", 2800),
  slide("02", "The problem and the opportunity: high awareness, low cultural buzz among Gen Z"),
  slide("03", "Twix delivers value twice", 2800),
  slide("04", "Insight: Gen Z does culture together, and every pack comes with two bars made to be shared", 6500),
  slide("05", "The idea: what if those two bars started the pass?", 7000),
  slide("06", "Execution: the Pass the Twix social participation challenge", 6500),
  slide("07", "Execution: Two bars, one team, the hero film concept"),
  slide("08", "Execution: the World Cup sweepstakes and real-time social engagement", 5500),
  slide("09", "Execution: World ChocoCup, the playable browser game", 4000),
];

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function TwixLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <MediaGroup>
        <Embed
          src={GAME_URL}
          title="World ChocoCup, the Twix New Bloods interactive"
          href={GAME_URL}
          poster={`${ASSETS}/TwixGame-cover.webp`}
          posterPlay={false}
          caption="The submitted build. Press space to kick."
        />
      </MediaGroup>

      <CaseStudySection index="/01" label="About" title="A Second Bar Is Not a Rival">
        <p>
          The Agency at the University of Florida entered the 2026 New Bloods Awards on the Twix brief. Twix had
          recognition but no conversation, and its messaging still ran on the Left versus Right rivalry that sets the
          two halves of the pack against each other. The team turned it around. Every pack has two bars, so the
          second one was never a rival. It was always something to hand over.
        </p>
        <p>
          I built the interactive piece of <strong>Pass the Twix</strong>, a browser game called{" "}
          <strong>World ChocoCup</strong>, and the environment it is played in.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <DeckSlides
          slides={DECK}
          label="The submission"
          caption="The nine slides that went to New Bloods."
        />
      </MediaGroup>

      <CaseStudySection index="/02" label="Idea" title="The Idea Is the Mechanic">
        <p>
          A film can show a pass. It cannot ask you to make one, and this brief was about participation. World
          ChocoCup opens on a corner with a teammate in the box and no route to the goal that skips them. The
          campaign line and the thing you do with your hands are the same move.
        </p>
      </CaseStudySection>

      <CaseStudySection index="/03" label="Input" title="One Key, Four Outcomes">
        <p>
          One key does everything. A ring closes onto a target and the space bar commits the kick, so timing the
          press is the whole skill. No aiming and no power meter, because a brand game gets a few seconds before
          somebody decides whether to keep going.
        </p>
      </CaseStudySection>

      <PaperDiagram caption="Four outcomes out of one key. Two are good in different amounts, and two fail in ways that feel different, which is what there is to get better at.">
        <PaperGrid>
          <PaperBox title="Perfect">Ring inside the target. Full force.</PaperBox>
          <PaperBox title="Good">Just outside it. Still gets there.</PaperBox>
          <PaperBox title="Early">Pressed too soon. Weak ball.</PaperBox>
          <PaperBox title="Miss">Ring runs out. Kicked anyway.</PaperBox>
        </PaperGrid>
      </PaperDiagram>

      <Band>
        <h2>Why the Ball Waits</h2>
        <p>
          The ball does not move on the frame you press. The input fires the animation first, the bar turns, the leg
          swings, and the force lands a beat later. Moving the ball on the press makes a kick feel like a button
          going down. The delay is what gives the swing its weight.
        </p>
      </Band>

      <CaseStudySection index="/04" label="Environment" title="A Stadium That Is Not a Model">
        <p>
          The pitch is physics and everything around it is drawn. The stadium is one mesh built at runtime from a
          radius, an arc and a height, its normals turned inward so the painted crowd faces in from wherever the
          camera goes. Nothing had to be modelled. The keeper, the goal and the two bars are painted art in a 3D
          scene, and the goal celebration is an eighty-four frame sequence rather than a rendered cutscene.
        </p>
      </CaseStudySection>

      <Outcome label="Outcome" href={GAME_URL} cta="Play World ChocoCup">
        The campaign went to New Bloods with a playable ending. It does not have to argue that two bars are better
        than one. It hands you the second one.
      </Outcome>
    </CaseStudyLayout>
  );
}
