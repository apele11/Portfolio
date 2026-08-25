import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { ProjectDetail } from "../types/project";

const DEFAULT_COLORS = {
  color1: "#05060a",
  color2: "#2094C5",
  color3: "#2b716b",
  color4: "#a9a2d7",
};

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function normalizeProjectDetail(projectId: string, rawData: unknown): ProjectDetail {
  const data = rawData && typeof rawData === "object" ? (rawData as Record<string, unknown>) : {};

  return {
    id: projectId,
    eyebrow: toString(data.eyebrow),
    header: toString(data.header, "Untitled Project"),
    subtitle: toString(data.subtitle),
    coverUrl: toString(data.coverUrl),
    fullDescription: toString(data.fullDescription),
    color1: toString(data.color1, DEFAULT_COLORS.color1),
    color2: toString(data.color2, DEFAULT_COLORS.color2),
    color3: toString(data.color3, DEFAULT_COLORS.color3),
    color4: toString(data.color4, DEFAULT_COLORS.color4),
    role: toStringArray(data.role),
    type: toString(data.type),
    skills: toStringArray(data.skills),
    date: toString(data.date),
    team: toStringArray(data.team),
    // Absent rather than 0 when unset, so the hero can tell "nobody entered a
    // headcount" apart from a document that genuinely claims one.
    teamSize: typeof data.teamSize === "number" && data.teamSize > 0 ? data.teamSize : undefined,
    order: typeof data.order === "number" ? data.order : 0,
  };
}

/**
 * Documents this session has already seen, by id.
 *
 * The home grid reads the whole `projects` collection, so every case study's
 * full document is in memory before the visitor clicks anything — the grid
 * just drops the detail fields on its way to a card. Keeping them here turns
 * opening a project from a network round trip into a Map lookup, which is the
 * whole difference between a spinner and no spinner: the page can render with
 * data on its first frame instead of after one.
 *
 * In-memory and per-session on purpose. It dies with the tab, so a reload is
 * always a fresh read and there is no cache invalidation to own. The one thing
 * it must not do is serve a document the app has not actually fetched this
 * session, which is why the build-time snapshot does not seed it — that file
 * is the card subset and would render a case study with empty prose.
 */
const projectCache = new Map<string, ProjectDetail>();

/** Record normalized documents for later synchronous reads. */
export function cacheProjects(projects: ProjectDetail[]): void {
  for (const project of projects) projectCache.set(project.id, project);
}

/**
 * Synchronous by design — callers use it to seed `useState`, and an async
 * lookup would put the loading frame back no matter how fast it resolved.
 */
export function getCachedProject(projectId: string | undefined): ProjectDetail | null {
  return projectId ? projectCache.get(projectId) ?? null : null;
}

/**
 * Firestore waits on its backend stream and does *not* reject when that stream
 * stalls — a state a phone reaches routinely by moving between Wi-Fi and
 * cellular, or by having the tab suspended and resumed. The promise simply
 * never settles, so a caller awaiting it holds its loading state forever: the
 * project page spinner that only clears by navigating away and back, because
 * remounting is what starts a second, healthy read.
 *
 * Racing a timer turns that silent hang into an ordinary rejection the UI can
 * act on. The timeout is generous — it is here to break a stall, not to police
 * a slow connection.
 */
const READ_TIMEOUT_MS = 8000;

function withTimeout<T>(work: Promise<T>, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(label + " timed out after " + READ_TIMEOUT_MS + "ms")),
      READ_TIMEOUT_MS
    );
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export async function fetchProjectById(projectId: string): Promise<ProjectDetail | null> {
  const read = () => withTimeout(getDoc(doc(db, "projects", projectId)), "project read");

  // One retry: the common case is a single stalled stream that the SDK has
  // already torn down and replaced by the time we ask again.
  let projectDoc;
  try {
    projectDoc = await read();
  } catch {
    projectDoc = await read();
  }

  if (!projectDoc.exists()) {
    return null;
  }

  const project = normalizeProjectDetail(projectId, projectDoc.data());
  cacheProjects([project]);
  return project;
}

/** Every project, normalized and sorted by `order` — for cross-links like a "discover more" footer. */
export async function fetchAllProjects(): Promise<ProjectDetail[]> {
  const snapshot = await getDocs(collection(db, "projects"));
  const projects = snapshot.docs
    .map((d) => normalizeProjectDetail(d.id, d.data()))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // The "discover more" footer calls this from inside a case study, so reading
  // it also warms every *other* study — project-to-project navigation lands
  // already populated.
  cacheProjects(projects);
  return projects;
}
