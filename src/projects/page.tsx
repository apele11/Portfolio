import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { fetchProjectById, getCachedProject } from "../data/projects";
import { resolveProjectLayout } from "../data/registry";
import { useSeo, clampDescription, SITE_TITLE, SITE_DESCRIPTION } from "../seo";
import type { ProjectDetail } from "../types/project";
import "./styles.css";

interface ProjectPageProps {
	projectId?: string;
	onBack?: () => void;
}

export default function ProjectPage({ projectId, onBack }: ProjectPageProps) {
	const params = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const resolvedProjectId = projectId ?? params.projectId;
	const handleBack = onBack ?? (() => navigate(-1));
	// Seeded from the session cache, which the home grid fills on its way to
	// rendering the cards. When it hits there is no loading frame at all — the
	// first render is the finished page. A cold entry (deep link, refresh) finds
	// nothing and falls back to the fetch below.
	const [project, setProject] = useState<ProjectDetail | null>(() =>
		getCachedProject(resolvedProjectId)
	);
	const [loading, setLoading] = useState(() => !getCachedProject(resolvedProjectId));
	const [error, setError] = useState<string | null>(null);
	// Bumping this re-runs the load effect. The read can time out on a phone
	// whose connection moved mid-request, and without a way to ask again the
	// only recovery was navigating back to the grid and re-entering.
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		if (!resolvedProjectId) {
			setError("Project not found");
			setProject(null);
			setLoading(false);
			return;
		}

		let isActive = true;

		// Re-checked here, not just in the initial state, because navigating from
		// one case study to another through "discover more" keeps this component
		// mounted — only the id changes, so useState's initializer never re-runs.
		const cached = getCachedProject(resolvedProjectId);
		if (cached) {
			setProject(cached);
			setError(null);
			setLoading(false);
		}

		const loadProject = async () => {
			try {
				// Only a cold entry gets the loading state. A cached hit revalidates
				// silently underneath the rendered page.
				if (!cached) setLoading(true);
				setError(null);

				const projectData = await fetchProjectById(resolvedProjectId);
				if (!isActive) return;

				if (!projectData) {
					setError("Project not found");
					setProject(null);
					return;
				}

				setProject(projectData);
			} catch (err) {
				console.error("Error loading project:", err);
				// A failed revalidation is not worth replacing a page the visitor is
				// already reading — the cached document is still the right answer.
				if (isActive && !cached) {
					setError("Failed to load project");
					setProject(null);
				}
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		loadProject();

		return () => {
			isActive = false;
		};
	}, [resolvedProjectId, attempt]);

	// Above the early returns, because hooks cannot be called conditionally. The
	// canonical is the case study's own URL from the first render — the URL is
	// what gets indexed, regardless of whether the document has arrived yet.
	useSeo({
		title: project ? `${project.header} — Emily Apel` : SITE_TITLE,
		description: project
			? clampDescription(project.subtitle || project.fullDescription)
			: SITE_DESCRIPTION,
		path: resolvedProjectId ? `/projects/${resolvedProjectId}` : "/",
	});

	if (loading) {
		return (
			<>
				<NavBar />
				<div className="project-page">Loading...</div>
			</>
		);
	}

	if (error || !project) {
		return (
			<>
				<NavBar />
				<div className="project-page">
					<div className="error-container">
						<p>{error}</p>
						<button
							type="button"
							className="error-retry"
							onClick={() => setAttempt((n) => n + 1)}
						>
							Try again
						</button>
					</div>
				</div>
			</>
		);
	}

	const Layout = resolveProjectLayout(project);
	return (
		<>
			<NavBar />
			<Layout project={project} onBack={handleBack} />
		</>
	);
}
