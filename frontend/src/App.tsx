import { useState } from "react";
import Login from "./Login";
import Projects from "./Projects";
import ProjectDetails from "./ProjectDetails";
import "./App.css";

interface Project {
    id: number;
    name: string;
    description: string;
}

function App() {

    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("token") !== null
    );

    const [selectedProject, setSelectedProject] =
        useState<Project | null>(null);

    if (!loggedIn) {

        return (
            <Login
                onLogin={() => setLoggedIn(true)}
            />
        );

    }

    if (selectedProject) {

        return (
            <ProjectDetails
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
            />
        );

    }

    return (
        <Projects
            onOpenProject={(project) => {
                setSelectedProject(project);
            }}
        />
    );
}

export default App;