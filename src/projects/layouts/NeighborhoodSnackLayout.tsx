import type { ProjectDetail } from "../../types/project";
import {
  CaseStudyLayout,
  CaseStudySection,
  Band,
  PaperDiagram,
  PaperRow,
  PaperGroup,
  PaperBox,
  PaperGrid,
  PaperArrow,
  PaperNote,
  Outcome,
} from "../case-study";

/*
 * Neighborhood Snack — a voice-driven conversation game in Unity.
 *
 * Everything asserted here was read off the Unity project at
 * Coding/Unity/neighborhood_snack (remote mtrats/neighborhood_snack), and only
 * off the scripts git attributes to Emily alone, all in Assets/Scripts/Emily:
 *
 *   VoiceRecorder                  5-second clip off the first mic, at 16 kHz
 *   WhisperService                 hand-written 16-bit WAV, POST to whisper-1,
 *                                  401 / 413 / 429 mapped to player-facing text
 *   SimpleGeminiMic                gemini-2.5-flash through Google.GenAI, JSON
 *                                  response type, full history replayed per turn
 *   INPCPersonality + 5 characters prompt rewritten in three trust phases, a
 *                                  -2..+2 rubric, and a keyword table in code
 *   TownspersonInteraction         Photon Fusion networked dialogue, trust and
 *                                  mic-busy state; state authority per speaker
 *   ProximityConversationTrigger   walking away resets trust and history
 *
 * Teammates (Milana Tratsevska: movement, multiplayer, camera, UI polish; Helen
 * Alvarez: start and end scenes) are credited by not claiming their work, as
 * on the Twix study. Dates come from the commit range, 2026-03-25 to
 * 2026-04-27.
 *
 * Also not mentioned: the shared "pineapple" keyword, worth 7 or 8 on every
 * character, which wins any door outright. It reads as a testing shortcut, not
 * a designed mechanic.
 *
 * Deliberately not quoted: the win threshold. SimpleGeminiMic.WinThreshold is
 * 7 while each personality's prompt tells the model trust is out of 6, so any
 * single number here would be wrong about one half of the code. The structure
 * (three phases, a five-step rubric, a keyword bonus on top) is consistent and
 * is what the copy describes.
 *
 * There is no public build and no capture of the game yet, so the study is
 * carried by diagrams. A clip of one full exchange (record, "listening",
 * "thinking", reply, trust tick) would sit well under /02.
 */

interface ProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function NeighborhoodSnackLayout({ project, onBack }: ProjectLayoutProps) {
  return (
    <CaseStudyLayout project={project} onBack={onBack}>
      <CaseStudySection index="/01" label="About" title="Talk Your Way Inside">
        <p>
          You are a vampire, and a vampire has to be invited in. Every townsperson behind
          every door is played by a language model, and the only controller is your voice. You press a button, say
          whatever you want, and the person on the other side decides how much they trust you.
        </p>
        <p>
          I built the conversation system for a team of three in Unity: the voice capture, the speech
          transcription, the calls to <strong>Google Gemini</strong>, the five characters, and the networked
          dialogue state that lets several players work the same street.
        </p>
      </CaseStudySection>

      <CaseStudySection index="/02" label="Pipeline" title="Two Models in Every Turn">
        <p>
          A turn passes through two models. The microphone records five seconds, which I encode to a WAV file in
          memory and send to <strong>OpenAI's Whisper API</strong> for a transcript. The transcript goes to{" "}
          <strong>Gemini 2.5 Flash</strong> with the character's prompt and the whole conversation so far. The API
          keeps no memory between calls, so the game replays every earlier exchange on every turn.
        </p>
      </CaseStudySection>

      <PaperDiagram
        summary="Speak → transcribe → prompt → reply → score"
        caption="One turn of conversation. Speech becomes text once, and the character answers with both a line and a judgement."
      >
        <PaperRow variant="phases">
          <PaperGroup label="01 · Hear">
            <PaperBox title="Record">Five seconds of microphone audio, encoded to WAV.</PaperBox>
            <PaperBox title="Transcribe">Whisper turns the clip into text.</PaperBox>
          </PaperGroup>
          <PaperArrow note="text" />
          <PaperGroup label="02 · Think">
            <PaperBox title="Build the prompt">The character, the current trust, and every earlier turn.</PaperBox>
            <PaperBox title="Ask Gemini">One call returns JSON and nothing else.</PaperBox>
          </PaperGroup>
          <PaperArrow note="JSON" />
          <PaperGroup label="03 · Answer">
            <PaperBox title="Reply and score" tint>
              The line is spoken to every player, and the score moves the trust meter.
            </PaperBox>
          </PaperGroup>
        </PaperRow>
      </PaperDiagram>

      <CaseStudySection index="/03" label="Characters" title="Five People Who Would Rather Not Open the Door">
        <p>
          Every character implements one C# interface. It supplies a name, a building, opening lines, a winning
          line, and a prompt that is rebuilt from the current trust score on every turn. A character does not just
          remember that you were nice. Their prompt changes underneath them, in three phases, from guarded to
          warming to nearly convinced.
        </p>
      </CaseStudySection>

      <PaperDiagram caption="Five characters behind one interface. Each wants a different kind of conversation, so no single approach opens every door.">
        <PaperGrid>
          <PaperBox title="Agnes">A frightened storekeeper who lives upstairs and keeps a light on late.</PaperBox>
          <PaperBox title="Barnaby">The gruff night clerk at the hotel, who is curious despite himself.</PaperBox>
          <PaperBox title="Dex">A cautious tenant behind a manual override door, who wants it to make sense.</PaperBox>
          <PaperBox title="Lyra">A friendly artist across from the music, who just wants you to be yourself.</PaperBox>
          <PaperBox title="Marco">A night shift worker nineteen hours into his day, who wants you to keep it short.</PaperBox>
        </PaperGrid>
      </PaperDiagram>

      <Band>
        <h2>Holding a Character in Role</h2>
        <p>
          Unscripted dialogue drifts. Each prompt states who the character is and what kind of night they are
          having, and sets a word limit that fits them. Most answer in under thirty words. Marco answers in under
          twenty, because he is too tired for long sentences. Every prompt also forbids any mention of trust
          scores, phases or anything else that would break the scene.
        </p>
      </Band>

      <CaseStudySection index="/04" label="Scoring" title="The Model Keeps Score, and So Does the Code">
        <p>
          Gemini is asked for JSON with two fields: the line of dialogue and a score from minus two to plus two.
          Each character's prompt carries its own rubric. Marco rewards being brief and kind and punishes being
          long-winded. Lyra rewards warmth and punishes coldness. Asking for structured output means the reply can be parsed
          straight into game state, with no guessing at what the model meant.
        </p>
        <p>
          The model judges tone, but tone is not everything a designer wants to guarantee. Each character also
          has a table of words that always count, checked in code against the transcript. Marco counts an
          apology or a promise to be quick. That gives the team a lever the model cannot overrule. Trust never
          drops below zero. Walking away from a door resets that character's trust and history, so every approach
          starts fresh.
        </p>
      </CaseStudySection>

      <CaseStudySection index="/05" label="Multiplayer" title="One Microphone for the Whole Street">
        <p>
          The game is multiplayer on <strong>Photon Fusion</strong>, and a conversation is shared. The dialogue,
          the trust score and a busy flag on the microphone are networked properties. Pressing record asks for
          authority over the conversation and waits up to two seconds for it, so only one player speaks at a time
          and everyone hears the same answer. When a character gives in, the winning line is sent to every player
          at once.
        </p>
      </CaseStudySection>

      <Band>
        <h2>Failing Out Loud</h2>
        <p>
          A voice game has more ways to fail than a button. The microphone can catch silence, the key can be wrong,
          and the API can rate-limit you. Each Whisper failure becomes a message the player can act on, such as
          asking them to wait a moment or try a shorter recording. Silence comes back as "Nothing was heard." While
          a turn is in flight the dialogue box says the character is listening, then thinking, so a slow reply
          never looks like a frozen game.
        </p>
      </Band>

      <PaperDiagram caption="What the player sees while the two models work. Each state is set as soon as the previous step finishes.">
        <PaperRow variant="phases">
          <PaperGroup label="Mic">
            <PaperBox title="Recording">The five-second window is open.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="Whisper">
            <PaperBox title="Listening">The clip is being transcribed.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="Gemini">
            <PaperBox title="Thinking">The character is deciding what to say.</PaperBox>
          </PaperGroup>
          <PaperArrow />
          <PaperGroup label="Done">
            <PaperBox title="Reply" tint>
              The line appears and the trust meter moves.
            </PaperBox>
          </PaperGroup>
        </PaperRow>
        <PaperNote center>If any step fails, the box shows what went wrong instead of waiting forever.</PaperNote>
      </PaperDiagram>

      <Outcome label="Outcome">
        Nothing in the game is scripted. Every door opens because of something a player actually said.
      </Outcome>
    </CaseStudyLayout>
  );
}
