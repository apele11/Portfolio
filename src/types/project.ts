export interface ProjectSection {
  id: string;
  type: "text" | "image" | "video" | "html";
  content: string; // For text, image URL, video URL, or raw HTML
}

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
  date: string; // "March, 2022"
  sections: ProjectSection[];
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
}
