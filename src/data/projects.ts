import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { ProjectDetail, ProjectSection } from "../types/project";

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

function toProjectSections(value: unknown, projectId: string): ProjectSection[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;

      const section = item as Record<string, unknown>;
      const type = section.type;
      const isValidType = type === "text" || type === "image" || type === "video" || type === "html";

      if (!isValidType) return null;

      return {
        id: toString(section.id, `${projectId}-section-${index}`),
        type,
        content: toString(section.content),
      } satisfies ProjectSection;
    })
    .filter((section): section is ProjectSection => section !== null);
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
    sections: toProjectSections(data.sections, projectId),
  };
}

export async function fetchProjectById(projectId: string): Promise<ProjectDetail | null> {
  const projectDoc = await getDoc(doc(db, "projects", projectId));
  if (!projectDoc.exists()) {
    return null;
  }

  return normalizeProjectDetail(projectId, projectDoc.data());
}
