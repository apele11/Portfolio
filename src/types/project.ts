export interface ProjectDetail {
  id: string;
  eyebrow: string;
  header: string;
  subtitle: string;
  coverUrl: string;
  fullDescription: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  role: string[]; // ["UX Designer", "Developer", ...]
  type: string; // "Group", "Solo", etc.
  skills: string[]; // ["Unity 3D", "React", ...]
  date: string; // "Aug - Dec, 2025" — a start and an end; see src/data/projectDate.ts
  /**
   * Who else built it. "Group" on its own is true of nearly every project here
   * and so tells a reader nothing; a headcount is the part worth reading. Set
   * `teamSize` when the number is all that matters, `team` to name people —
   * naming them derives the count, so the two are never both required.
   */
  team?: string[]; // ["Ada Lovelace", ...]
  teamSize?: number; // 8
  order?: number;
}

export interface Project {
  id: string;
  eyebrow: string;
  header: string;
  subtitle: string;
  coverUrl: string;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  order?: number;
}
