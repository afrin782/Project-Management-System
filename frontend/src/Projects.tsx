import { useEffect, useState } from "react";
import api from "./api";
import {
    connectWebSocket,
    disconnectWebSocket
} from "./WebSocketService";

interface Project {
    id: number;
    name: string;
    description: string;
}

interface ProjectsProps {
    onOpenProject: (project: Project) => void;
}

function Projects({ onOpenProject }: ProjectsProps) {

    const [projects, setProjects] = useState<Project[]>([]);
    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [formMessage, setFormMessage] = useState("");

    // =========================
    // LOAD PROJECTS
    // =========================

    const loadProjects = () => {

        const token = localStorage.getItem("token");

        api.get("/projects", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {

            setProjects(response.data);

        })
        .catch(error => {

            console.log(error);

        });
    };

    // =========================
    // LOAD + WEBSOCKET
    // =========================

    useEffect(() => {

        loadProjects();

        connectWebSocket((receivedMessage) => {

            setMessage(receivedMessage);

        });

        return () => {

            disconnectWebSocket();

        };

    }, []);

    // =========================
    // CREATE PROJECT
    // =========================

    const createProject = async () => {

        if (projectName.trim() === "") {

            setFormMessage(
                "Project name is required"
            );

            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response =
                await api.post(
                    "/projects",
                    {
                        name: projectName.trim(),
                        description:
                            projectDescription.trim()
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setProjects([
                ...projects,
                response.data
            ]);

            setProjectName("");
            setProjectDescription("");
            setFormMessage("");
            setShowForm(false);

        } catch (error) {

            console.log(error);

            setFormMessage(
                "Failed to create project"
            );
        }
    };

    // =========================
    // DELETE PROJECT
    // =========================

    const deleteProject = async (
        projectId: number
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this project?"
            );

        if (!confirmDelete) {

            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            await api.delete(
                `/projects/${projectId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            // Remove project from UI
            setProjects(
                projects.filter(
                    project =>
                        project.id !== projectId
                )
            );

            setMessage(
                "Project deleted successfully"
            );

        } catch (error) {

            console.log(error);

            setMessage(
                "Failed to delete project"
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem("token");

        window.location.reload();
    };

    // =========================
    // UI
    // =========================

    return (

        <div className="projects-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="navbar">

                <h1>
                    Project Management Tool
                </h1>

                <button
                    onClick={logout}
                >
                    Logout
                </button>

            </header>


            {/* =========================
                MAIN
            ========================= */}

            <main className="projects-container">

                {/* =========================
                    PROJECT HEADER
                ========================= */}

                <div className="projects-header">

                    <div>

                        <h2>
                            My Projects
                        </h2>

                        <p>
                            Manage your projects and tasks
                        </p>

                    </div>


                    <button
                        className="new-project-button"
                        onClick={() => {

                            setShowForm(
                                !showForm
                            );

                            setFormMessage("");

                        }}
                    >
                        + New Project
                    </button>

                </div>


                {/* =========================
                    CREATE PROJECT FORM
                ========================= */}

                {showForm && (

                    <div className="create-project-form">

                        <h2>
                            Create New Project
                        </h2>


                        <input
                            type="text"
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) =>
                                setProjectName(
                                    e.target.value
                                )
                            }
                        />


                        <textarea
                            placeholder="Project Description"
                            value={projectDescription}
                            onChange={(e) =>
                                setProjectDescription(
                                    e.target.value
                                )
                            }
                        />


                        {formMessage && (

                            <p className="form-error">

                                {formMessage}

                            </p>

                        )}


                        <div className="form-buttons">

                            <button
                                className="create-button"
                                onClick={createProject}
                            >
                                Create Project
                            </button>


                            <button
                                className="cancel-button"
                                onClick={() => {

                                    setShowForm(false);

                                    setProjectName("");

                                    setProjectDescription("");

                                    setFormMessage("");

                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                )}


                {/* =========================
                    PROJECT CARDS
                ========================= */}

                <div className="projects-grid">

                    {projects.map(
                        (project) => (

                            <div
                                className="project-card"
                                key={project.id}
                            >

                                {/* PROJECT NAME */}

                                <h3>
                                    {project.name}
                                </h3>


                                {/* DESCRIPTION */}

                                <p>
                                    {project.description}
                                </p>


                                {/* PROJECT ID */}

                                <div className="project-info">

                                    Project ID:{" "}
                                    {project.id}

                                </div>


                                {/* OPEN PROJECT */}

                                <button
                                    className="open-button"
                                    onClick={() =>
                                        onOpenProject(
                                            project
                                        )
                                    }
                                >
                                    Open Project →
                                </button>


                                {/* DELETE PROJECT */}

                                <button
                                    className="delete-project-button"
                                    onClick={() =>
                                        deleteProject(
                                            project.id
                                        )
                                    }
                                >
                                    🗑 Delete Project
                                </button>

                            </div>

                        )
                    )}

                </div>


                {/* =========================
                    NO PROJECTS
                ========================= */}

                {projects.length === 0 && (

                    <p className="no-projects">

                        No projects found.

                    </p>

                )}


                {/* =========================
                    WEBSOCKET MESSAGE
                ========================= */}

                {message && (

                    <div className="realtime-message">

                        🔔 {message}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Projects;