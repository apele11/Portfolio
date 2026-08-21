import type { ComponentType } from "react";
import type { ProjectDetail } from "../types/project";
import DefaultProjectHero from "../projects/layouts/DefaultProjectHero";
import LockedInProjectLayout from "../projects/layouts/LockedInProjectLayout";
import NewBusinessLayout from "../projects/layouts/NewBusinessLayout";
import Libre3DLayout from "../projects/layouts/Libre3DLayout";

export type ProjectLayoutProps = {
  project: ProjectDetail;
  onBack: () => void;
};

export type ProjectLayoutComponent = ComponentType<ProjectLayoutProps>;

interface LayoutRegistryEntry {
  matches: (project: ProjectDetail) => boolean;
  component: ProjectLayoutComponent;
}

const headerIncludes = (project: ProjectDetail, ...keywords: string[]) => {
  const header = project.header.toLowerCase();
  return keywords.some((keyword) => header.includes(keyword));
};

/**
 * Bespoke, hardcoded case-study layouts. Each project is matched by a keyword
 * in its header — the Firestore document id is not reliable — and the first
 * match wins. Projects with no match fall back to DefaultProjectHero (the
 * generic, metadata-only hero).
 *
 * To add a new case study: build its layout in src/projects/layouts/ (compose
 * the primitives in src/projects/case-study/), then add one entry here.
 */
const layoutRegistry: LayoutRegistryEntry[] = [
  {
    matches: (project) => headerIncludes(project, "locked in", "lockedin"),
    component: LockedInProjectLayout,
  },
  {
    matches: (project) => headerIncludes(project, "new business"),
    component: NewBusinessLayout,
  },
  {
    matches: (project) => headerIncludes(project, "libre3d", "libre 3d"),
    component: Libre3DLayout,
  },
];

export function resolveProjectLayout(project: ProjectDetail): ProjectLayoutComponent {
  return layoutRegistry.find((entry) => entry.matches(project))?.component ?? DefaultProjectHero;
}
