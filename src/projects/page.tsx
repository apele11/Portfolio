import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchProjectById } from "../data/projects";
import { getProjectLayout } from "../data/registry";
import type { ProjectDetail } from "../types/project";
import "./styles.css";

interface ProjectPageProps {
	projectId: string;
	onBack: () => void;
	onAdminClick?: () => void;
}

export default function ProjectPage({ projectId, onBack, onAdminClick }: ProjectPageProps) {
	const [project, setProject] = useState<ProjectDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		const loadProject = async () => {
			try {
				setLoading(true);
				setError(null);

				const projectData = await fetchProjectById(projectId);
				if (!isActive) return;

				if (!projectData) {
					setError("Project not found");
					setProject(null);
					return;
				}

				setProject(projectData);
			} catch (err) {
				console.error("Error loading project:", err);
				if (isActive) {
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
	}, [projectId]);

	if (loading) {
		return (
			<>
				<NavBar onAdminClick={onAdminClick} />
				<div className="project-page">Loading...</div>
			</>
		);
	}

	if (error || !project) {
		return (
			<>
				<NavBar onAdminClick={onAdminClick} />
				<div className="project-page">
					<div className="error-container">
						<p>{error}</p>
						<button onClick={onBack} className="back-button">
							Back to Projects
						</button>
					</div>
				</div>
			</>
		);
	}

	const Layout = getProjectLayout(project.id);
	return (
		<>
			<NavBar onAdminClick={onAdminClick} />
			<Layout project={project} onBack={onBack} />
		</>
	);
}
