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
 * Jukebox, Open Source Club.
 *
 * Everything asserted in this file was read off the Jukebox-Frontend repo
 * (src/apps/public/*, package.json) rather than recalled, so it is safe to
 * leave as written. What is NOT here, because nobody could verify it from the
 * code, is marked TODO below. Fill those in before this ships.
 *
 * Media: the landing capture is the full public page at 1440 css px wide,
 * stitched (3635px tall), which is why it goes through ScrollFigure rather than
 * Figure. The accordion clip is 1440x900, 11.7s.
 *
 * Drop raw files into public/assets/Jukebox/ and run `npm run assets`, which
 * writes them to public/assets/compressed/Jukebox/ where ASSETS points.
 */

const ASSETS = "/assets/compressed/Jukebox";

const MEDIA = {
  /** Full-length capture of the public landing page. */
  landing: `${ASSETS}/Jukebox-Landing-Full.webp`,
  /** The repositories accordion opening and closing. */
  accordion: `${ASSETS}/accordion-jukebox.mp4`,
  cover: `${ASSETS}/Jukebox-OpenSource-Cover.webp`,
};

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function JukeboxLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <CaseStudySection index="/01" label="About">
        <p>
          <strong>Jukebox</strong> is a web application built with the Open Source Club at the University of
          Florida. A group connects one Spotify account and everyone in the room queues songs to it from their own
          device, so the playlist belongs to the group rather than to whoever is sitting next to the laptop. It is
          the old jukebox idea rebuilt on the Spotify API, with React and TypeScript on the front end and a socket
          connection keeping every device looking at the same list as it changes.
        </p>
        {/* TODO: your role, when you worked on it, and what you owned versus what
            the club owned. Libre3DLayout /01 has the shape of this paragraph.
            Left blank rather than guessed. */}
      </CaseStudySection>

      <CaseStudySection index="/02" label="Interface" title="A Front Door for an Open Source Project">
        <p>
          Jukebox has two audiences that want opposite things. People who might use it want to know what it does in a
          sentence, and people who might contribute want to know what the codebase is and where to start. The page
          moves from claim to proof to invitation so it can serve the second without making the first read past them,
          and it closes by asking for a pull request rather than a signup.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <ScrollFigure
          src={MEDIA.landing}
          alt="The full Jukebox public landing page, from the hero through to the footer"
          label="Landing page"
          caption="The full public page at desktop width. Hero, mission, feature grid, repositories, and the contributor call to action."
        />
      </MediaGroup>

      <CaseStudySection index="/03" label="Component" title="An Accordion That Does Not Move the Page">
        <p>
          The obvious version of this control makes the page jump. A panel opens to whatever height its content
          happens to be, everything below it slides, and the row you were about to read has moved by the time you
          look back. This one measures twice instead. It takes the content height and the space the list has left
          once every collapsed header is accounted for, then opens to the larger of the two, so the section holds one
          height the whole time you are reading it.
        </p>
      </CaseStudySection>

      <MediaGroup>
        <VideoFigure
          src={MEDIA.accordion}
          poster={MEDIA.cover}
          showProgress
          caption="One panel open at a time. The list keeps a constant height, so nothing below the accordion moves while you read."
        />
      </MediaGroup>

      <Band>
        <h2>Built to Be Handed Over</h2>
        <p>
          A club project outlives the people who wrote it, so the parts of this that are reusable are the parts worth
          showing. The accordion takes its items as data and knows nothing about repositories. The buttons are one
          component with an appearance prop rather than a set of variants. The theming runs through SCSS custom
          properties, which is what lets the same button sit on a white hero and a dark red panel without a second
          definition.
        </p>
      </Band>

      {/* TODO: this closes on STATUS because there is no public launch or
          adoption number to point at from the code alone. If the club is running
          it, say so here and add href + cta pointing at the repo or the live
          site. See LockedInProjectLayout for an Outcome with a CTA. */}
      <Outcome label="Status">
        The public site is built and the queue runs on live Spotify playback. Next is finishing the contributor
        content on the landing page and getting it in front of the club.
      </Outcome>
    </CaseStudyLayout>
  );
}
