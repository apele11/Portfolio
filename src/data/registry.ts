import type { ComponentType } from "react";
import type { ProjectDetail } from "../types/project";
import DefaultProjectLayout from "../projects/layouts/DefaultProjectLayout";
import FeatureProjectLayout from "../projects/layouts/FeatureProjectLayout";

export type ProjectLayoutProps = {
  project: ProjectDetail;
  onBack: () => void;
};

export type ProjectLayoutComponent = ComponentType<ProjectLayoutProps>;

export const FEATURED_PROJECT_ID = "replace-with-your-project-id";

const projectLayoutRegistry: Record<string, ProjectLayoutComponent> = {
  [FEATURED_PROJECT_ID]: FeatureProjectLayout,
};

export function getProjectLayout(projectId: string): ProjectLayoutComponent {
  return projectLayoutRegistry[projectId] ?? DefaultProjectLayout;
}

export { projectLayoutRegistry };
