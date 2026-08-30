import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  ScrollFigure,
  VideoFigure,
  MediaGroup,
  Outcome,
} from "../case-study";

/*
 * Pink Ahead.
 *
 * IN PROGRESS. The project is not finished and the creative department has not
 * cleared the copyright yet, so this should not be deployed as-is. Two separate
 * things are outstanding:
 *
 *   1. Rights. The media below is a capture of the live site, which means it
 *      carries the campaign photography. Until creative signs off, publishing
 *      this page republishes that imagery. The layout is safe to keep in the
 *      repo; what is gated is the Firestore doc that makes it reachable.
 *   2. Copy. Every observation about the interface was read off the running site
 *      at localhost:3000 (served markup, Tailwind classes, inline styles) rather
 *      than recalled, so it is safe to leave as written. The two things the front
 *      end cannot tell you, the split of ownership in /01 and the launch plan in
 *      the Outcome, came from Emily directly and are hers to correct.
 *
 * Media: the landing capture is the full public page at 1440 css px wide and
 * 4031 tall, and the About capture is 1440x3192, which is why both go through
 * ScrollFigure rather than Figure. The hover clip is 1440x606, 8.9s, and loops.
 *
 * The About capture carries seven blocks of lorem ipsum, because the page is
 * built but its copy is not written. The caption says so rather than hoping
 * nobody reads the screenshot. If it still looks unfinished once the rest of
 * the study is final, cut the figure and keep /03 as prose, or re-shoot it when
 * the real copy lands.
 *
 * Drop raw files into public/assets/PinkAhead/ and run `npm run assets`, which
 * writes them to public/assets/compressed/PinkAhead/ where ASSETS points.
 */

const ASSETS = "/assets/compressed/PinkAhead";

const MEDIA = {
  /** Full-length capture of the public landing page. */
  landing: `${ASSETS}/PinkAhead-Landing-Full.webp`,
  /** Full-length capture of the About page, the interior template. */
  about: `${ASSETS}/PinkAhead-About-Full.webp`,
  /** Button and carousel-control hover states in the Your Stories section. */
  hover: `${ASSETS}/hoverstates-pinkahead.mp4`,
  cover: `${ASSETS}/PinkAhead-cover.webp`,
};

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function PinkAheadLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <CaseStudySection index="/01" label="About">
        <p>
          <strong>Pink Ahead</strong> is a breast health awareness site. Its argument is in the first line of the
          statement: breast health belongs in a self-care routine rather than on a calendar, and it should be a
          ritual rather than a reminder. That framing decides everything that follows. The hero is a flat lay of
          cosmetics rather than a clinic, the sections are titled Your Journey and Your Stories rather than
          Screening and Testimonials, and the three ways in are Care, Resources, and Community.
        </p>
        <p>
          I built the front end. The creative department owned the brand and the design file, handing over full
          branding for the nonprofit along with a set of mocked screens, and my work was turning that file into a
          running site. A Figma frame is one width holding one state. A site is every width holding every state, so
          the decisions described below are mostly the ones that live between the frames: how the type behaves at
          the sizes nobody drew, what a control does under a cursor, and which parts of the layout are allowed to
          move when the viewport does.
        </p>
      </CaseStudySection>

      <CaseStudySection index="/02" label="Type" title="One Typeface at Two Widths">
        <p>
          The headings and the body text are the same font file. Acumin Variable carries a width axis, so the
          condensed display type and the normal-width paragraphs are two settings of one typeface rather than two
          families that have to be kept in agreement as the site grows. Headings and navigation run at a width of
          50, body copy at 100. A single axis value is the whole difference between the voice of a section title and
          the voice of a paragraph, which is one fewer thing to get wrong when somebody adds a page later.
        </p>
        <p>
          Size is handled separately from width, and continuously. Section headings are set in a clamp between 36
          and 64 pixels and body copy between 16 and 28, so type resolves against the viewport rather than jumping
          at a breakpoint. Layout does the opposite and steps deliberately: the header is 80 pixels tall and becomes
          120 at medium, and the hero moves through 500, 600, and 700. Text scales, structure snaps.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <ScrollFigure
          src={MEDIA.landing}
          alt="The full Pink Ahead landing page, from the hero through to the footer"
          label="Landing page"
          caption="The full public page at desktop width. Hero carousel, statement, Your Journey, Your Stories, and the footer."
        />
      </MediaGroup>

      <CaseStudySection index="/03" label="Template" title="What an Interior Page Inherits">
        <p>
          The landing page leads with a photograph. Every interior page leads with the same shape filled flat, a
          band of brand pink carrying the page name in the condensed display width. That one substitution is what
          separates the front door from the rooms behind it, and it means a new section can be added without anyone
          having to source another hero image first.
        </p>
        <p>
          The navigation reports position rather than just offering destinations. The link for the page you are on
          takes the brand pink while the other four stay near-black, which is the same treatment Home carries on the
          landing page. Below that, the story block reverses the hero relationship and sets text beside a
          photograph in two columns, and the questions at the foot of the page are built from the same outlined
          rectangle as the buttons. A collapsed row carries a circled arrow pointing down, and the open row turns
          the arrow up and drops its answer inside the existing outline, so the box grows rather than a second panel
          appearing beneath it.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <ScrollFigure
          src={MEDIA.about}
          alt="The full Pink Ahead About page, from the title band through the story block and questions to the footer"
          label="About page"
          caption="The interior template at desktop width. The pink title band stands in for the hero, and the questions reuse the button outline. Body copy is placeholder while the final text is written."
        />
      </MediaGroup>

      <CaseStudySection index="/04" label="Interaction" title="Buttons That Invert Rather Than Restyle">
        <p>
          Every action on the page is one rule read in both directions. At rest a button is a solid pink block
          carrying white text. On hover the fill drops out and the same shape comes back as a pink outline with pink
          text, holding its position and its size exactly. The circular carousel controls do the same thing, so an
          arrow and a Watch button are the same idea at two scales rather than two components with separate hover
          treatments.
        </p>
        <p>
          Nothing reflows while this happens. The border occupies space the resting state has already accounted for,
          so hovering a control never nudges the row it sits in. Keyboard users get the state too: the controls carry
          a visible focus ring rather than relying on hover alone to say what is interactive.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <VideoFigure
          src={MEDIA.hover}
          poster={MEDIA.cover}
          showProgress
          caption="Filled at rest, outlined on hover. The button holds its footprint through the change, so the row underneath stays still."
        />
      </MediaGroup>

      <Band>
        <h2>Two Palettes, Not Twenty</h2>
        <p>
          The site runs on one pink and one near-black. The pink carries every interactive element, the section
          rules, and the footer, and the near-black carries type and the media wells. Because the palette is that
          short, the pink reads as a signal rather than as decoration: when it appears on a shape, that shape does
          something. The hero earns its intensity by breaking the same rule once, laying a half-opacity pink over
          the photograph so the wordmark has a field to sit on without a box being drawn around it.
        </p>
        <p>
          The navigation collapses rather than shrinks. Above the large breakpoint the five destinations sit
          horizontally at display width, and below it they are replaced by a labelled toggle that reports its own
          state, so the mobile header keeps the wordmark and the two utility icons at a real tap size instead of
          five compressed links.
        </p>
      </Band>

      {/* Still STATUS rather than OUTCOME: the site has not launched, so there is
          no reach or adoption figure to point at. On launch, switch the label to
          "Outcome" and add href + cta pointing at the live site. See
          LockedInProjectLayout for an Outcome with a CTA. */}
      <Outcome label="Status">
        Pink Ahead will launch as the nonprofit's official site. The type system, palette, navigation, and
        interaction states are built and running, and what is outstanding is copy and the video wells that are
        holding their aspect ratio until the final cuts arrive. The build after launch is a mammogram locator, a
        database of screening locations drawn onto a map, so that someone the statement has just persuaded can find
        out where to actually go.
      </Outcome>
    </CaseStudyLayout>
  );
}
