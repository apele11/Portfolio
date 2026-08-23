// Builds the "Type" lines in the project hero metadata.
//
// Every document in the collection sets `type: "Group"`, so on its own that word
// separates nothing from nothing. A headcount is the part a reader can use, and
// naming the collaborators derives that count for free — so a document supplies
// whichever it has and this resolves the rest.

import type { ProjectDetail } from "../types/project";

type TeamFields = Pick<ProjectDetail, "type" | "team" | "teamSize">;

/**
 * "Group of 8", plus the names underneath when the document lists them.
 *
 * Falls back to the bare `type` string when neither a size nor a roster is set,
 * so a document nobody has filled in yet reads exactly as it did before — and a
 * genuinely solo project is never inflated into a group of one.
 */
export function describeTeam({ type, team, teamSize }: TeamFields): string[] {
  const kind = type.trim() || "Group";
  const named = (team ?? []).map((name) => name.trim()).filter(Boolean);
  const count = teamSize ?? named.length;

  if (count > 1) {
    const headline = `${kind} of ${count}`;
    return named.length ? [headline, named.join(", ")] : [headline];
  }
  return type.trim() ? [type.trim()] : [];
}
