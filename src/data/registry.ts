import type { ComponentType } from "react";
import type { ProjectDetail } from "../types/project";
import DefaultProjectHero from "../projects/layouts/DefaultProjectHero";


import LockedInProjectLayout from "../projects/layouts/LockedInProjectLayout";

export type ProjectLayoutProps = {
  project: ProjectDetail;
  onBack: () => void;
};

export type ProjectLayoutComponent = ComponentType<ProjectLayoutProps>;

const projectLayoutRegistry: Record<string, ProjectLayoutComponent> = {
  "lockedin": LockedInProjectLayout,
};

export function getProjectLayout(projectId: string): ProjectLayoutComponent {
  return projectLayoutRegistry[projectId] ?? DefaultProjectHero;
}

export { projectLayoutRegistry };
