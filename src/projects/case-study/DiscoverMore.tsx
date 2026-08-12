import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProjects } from "../../data/projects";
import type { ProjectDetail } from "../../types/project";

interface DiscoverMoreProps {
  /** Excluded from its own "more projects" list. */
  currentProjectId: string;
}

/** Closing cross-link list: every other project, title against its tags, each row one link. */
export default function DiscoverMore({ currentProjectId }: DiscoverMoreProps) {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);

  useEffect(() => {
    let isActive = true;

    fetchAllProjects()
      .then((all) => {
        if (isActive) setProjects(all.filter((p) => p.id !== currentProjectId));
      })
      .catch((error) => console.error("Error loading discover-more projects:", error));

    return () => {
      isActive = false;
    };
  }, [currentProjectId]);

  if (projects.length === 0) return null;

  return (
    <section className="cs-discover-bleed">
      <nav className="cs-discover" aria-label="More projects">
        <p className="cs-discover__label">Discover more projects</p>
        <ul className="cs-discover__list">
          {projects.map((p) => (
            <li key={p.id}>
              <Link to={`/projects/${p.id}`} className="cs-discover__row">
                <span className="cs-discover__title">{p.header}</span>
                {p.skills.length > 0 && <span className="cs-discover__tags">{p.skills.join(", ")}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
