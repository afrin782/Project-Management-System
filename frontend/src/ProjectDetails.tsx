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

interface ProjectDetailsProps {
    project: Project;
    onBack: () => void;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    projectId: number;
    assignedUserId: number;
}

interface Comment {
    id: number;
    message: string;
    taskId: number;
    userId: number;
}

interface Member {
    id: number;
    projectId: number;
    userId: number;
}

interface Notification {
    id: number;
    message: string;
    userId: number;
    read: boolean;
}

interface Dashboard {
    projectId: number;
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    totalMembers: number;
}

function ProjectDetails({
    project,
    onBack
}: ProjectDetailsProps) {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [dashboard, setDashboard] =
        useState<Dashboard | null>(null);

    const [members, setMembers] =
        useState<Member[]>([]);

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [message, setMessage] =
        useState("");

    const [showTaskForm, setShowTaskForm] =
        useState(false);

    const [editingTaskId, setEditingTaskId] =
        useState<number | null>(null);

    const [taskTitle, setTaskTitle] =
        useState("");

    const [taskDescription, setTaskDescription] =
        useState("");

    const [taskStatus, setTaskStatus] =
        useState("TODO");

    const [assignedUserId, setAssignedUserId] =
        useState("");

    const [taskMessage, setTaskMessage] =
        useState("");

    const [memberUserId, setMemberUserId] =
        useState("");

    const [memberMessage, setMemberMessage] =
        useState("");

    const [commentInputs, setCommentInputs] =
        useState<Record<number, string>>({});

    const [commentUserIds, setCommentUserIds] =
        useState<Record<number, string>>({});

    const [comments, setComments] =
        useState<Record<number, Comment[]>>({});

    const [notificationUserId, setNotificationUserId] =
        useState("");

    const [notificationMessage, setNotificationMessage] =
        useState("");

    const [notificationStatus, setNotificationStatus] =
        useState("");


    // =========================
    // TOKEN
    // =========================

    const getToken = () => {

        return localStorage.getItem("token");

    };


    // =========================
    // LOAD DASHBOARD
    // =========================

    const loadDashboard = async () => {

        try {

            const response =
                await api.get(
                    `/projects/${project.id}/dashboard`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${getToken()}`
                        }
                    }
                );

            setDashboard(response.data);

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // LOAD TASKS
    // =========================

    const loadTasks = async () => {

        try {

            const response =
                await api.get(
                    `/tasks/project/${project.id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${getToken()}`
                        }
                    }
                );

            setTasks(response.data);

            response.data.forEach(
                (task: Task) => {
                    loadComments(task.id);
                }
            );

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // LOAD MEMBERS
    // =========================

    const loadMembers = async () => {

        try {

            const response =
                await api.get(
                    `/project-members/project/${project.id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${getToken()}`
                        }
                    }
                );

            setMembers(response.data);

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // LOAD COMMENTS
    // =========================

    const loadComments = async (
        taskId: number
    ) => {

        try {

            const response =
                await api.get(
                    `/comments/task/${taskId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${getToken()}`
                        }
                    }
                );

            setComments(
                previous => ({
                    ...previous,
                    [taskId]: response.data
                })
            );

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // LOAD NOTIFICATIONS
    // =========================

    const loadNotifications = async () => {

        if (
            notificationUserId.trim() === ""
        ) {

            setNotificationStatus(
                "Enter User ID"
            );

            return;
        }

        try {

            const response =
                await api.get(
                    `/notifications/user/${notificationUserId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${getToken()}`
                        }
                    }
                );

            setNotifications(response.data);

            setNotificationStatus(
                "Notifications loaded successfully"
            );

        } catch (error) {

            console.log(error);

            setNotificationStatus(
                "Failed to load notifications"
            );

        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        loadDashboard();
        loadTasks();
        loadMembers();

        connectWebSocket(
            (receivedMessage) => {

                setMessage(receivedMessage);

                loadDashboard();
                loadTasks();
                loadMembers();

            }
        );

        return () => {

            disconnectWebSocket();

        };

    }, [project.id]);


    // =========================
    // CREATE TASK
    // =========================

    const createTask = async () => {

        if (
            taskTitle.trim() === ""
        ) {

            setTaskMessage(
                "Task title is required"
            );

            return;
        }

        try {

            await api.post(
                "/tasks",
                {
                    title:
                        taskTitle.trim(),

                    description:
                        taskDescription.trim(),

                    status:
                        taskStatus,

                    projectId:
                        project.id,

                    assignedUserId:
                        assignedUserId.trim() === ""
                            ? null
                            : Number(assignedUserId)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setTaskTitle("");
            setTaskDescription("");
            setTaskStatus("TODO");
            setAssignedUserId("");
            setTaskMessage("");
            setShowTaskForm(false);

            loadTasks();
            loadDashboard();

        } catch (error) {

            console.log(error);

            setTaskMessage(
                "Failed to create task"
            );

        }
    };


    // =========================
    // EDIT TASK
    // =========================

    const startEditTask = (
        task: Task
    ) => {

        setEditingTaskId(task.id);

        setTaskTitle(task.title);

        setTaskDescription(
            task.description
        );

        setTaskStatus(task.status);

        setAssignedUserId(
            task.assignedUserId
                ? String(task.assignedUserId)
                : ""
        );

        setShowTaskForm(true);

        setTaskMessage("");

    };


    // =========================
    // UPDATE TASK
    // =========================

    const updateTask = async () => {

        if (
            editingTaskId === null
        ) {

            return;
        }

        if (
            taskTitle.trim() === ""
        ) {

            setTaskMessage(
                "Task title is required"
            );

            return;
        }

        try {

            await api.put(
                `/tasks/${editingTaskId}`,
                {
                    title:
                        taskTitle.trim(),

                    description:
                        taskDescription.trim(),

                    status:
                        taskStatus,

                    projectId:
                        project.id,

                    assignedUserId:
                        assignedUserId.trim() === ""
                            ? null
                            : Number(assignedUserId)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setEditingTaskId(null);
            setTaskTitle("");
            setTaskDescription("");
            setTaskStatus("TODO");
            setAssignedUserId("");
            setTaskMessage("");
            setShowTaskForm(false);

            loadTasks();
            loadDashboard();

        } catch (error) {

            console.log(error);

            setTaskMessage(
                "Failed to update task"
            );

        }
    };


    // =========================
    // DELETE TASK
    // =========================

    const deleteTask = async (
        taskId: number
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmDelete) {

            return;
        }

        try {

            await api.delete(
                `/tasks/${taskId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setTasks(
                previous =>
                    previous.filter(
                        task =>
                            task.id !== taskId
                    )
            );

            loadDashboard();

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // CHANGE TASK STATUS
    // =========================

    const changeTaskStatus = async (
        task: Task,
        newStatus: string
    ) => {

        try {

            await api.put(
                `/tasks/${task.id}`,
                {
                    title:
                        task.title,

                    description:
                        task.description,

                    status:
                        newStatus,

                    projectId:
                        task.projectId,

                    assignedUserId:
                        task.assignedUserId
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setTasks(
                previous =>
                    previous.map(
                        item =>
                            item.id === task.id
                                ? {
                                    ...item,
                                    status:
                                        newStatus
                                }
                                : item
                    )
            );

            loadDashboard();

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // CANCEL TASK FORM
    // =========================

    const cancelTaskForm = () => {

        setShowTaskForm(false);

        setEditingTaskId(null);

        setTaskTitle("");

        setTaskDescription("");

        setTaskStatus("TODO");

        setAssignedUserId("");

        setTaskMessage("");

    };


    // =========================
    // ADD COMMENT
    // =========================

    const addComment = async (
        taskId: number
    ) => {

        const commentText =
            commentInputs[taskId] || "";

        const userId =
            commentUserIds[taskId] || "";

        if (
            commentText.trim() === ""
        ) {

            return;
        }

        if (
            userId.trim() === ""
        ) {

            return;
        }

        try {

            await api.post(
                "/comments",
                {
                    message:
                        commentText.trim(),

                    taskId:
                        taskId,

                    userId:
                        Number(userId)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setCommentInputs(
                previous => ({
                    ...previous,
                    [taskId]: ""
                })
            );

            loadComments(taskId);

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // DELETE COMMENT
    // =========================

    const deleteComment = async (
        commentId: number,
        taskId: number
    ) => {

        try {

            await api.delete(
                `/comments/${commentId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            loadComments(taskId);

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // ADD MEMBER
    // =========================

    const addMember = async () => {

        if (
            memberUserId.trim() === ""
        ) {

            setMemberMessage(
                "Enter User ID"
            );

            return;
        }

        try {

            await api.post(
                "/project-members",
                {
                    projectId:
                        project.id,

                    userId:
                        Number(memberUserId)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setMemberUserId("");

            setMemberMessage(
                "Member added successfully"
            );

            loadMembers();
            loadDashboard();

        } catch (error) {

            console.log(error);

            setMemberMessage(
                "Failed to add member"
            );

        }
    };


    // =========================
    // CREATE NOTIFICATION
    // =========================

    const createNotification = async () => {

        if (
            notificationUserId.trim() === ""
        ) {

            setNotificationStatus(
                "Enter User ID"
            );

            return;
        }

        if (
            notificationMessage.trim() === ""
        ) {

            setNotificationStatus(
                "Enter notification message"
            );

            return;
        }

        try {

            await api.post(
                "/notifications",
                {
                    userId:
                        Number(notificationUserId),

                    message:
                        notificationMessage.trim(),

                    read:
                        false
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setNotificationMessage("");

            setNotificationStatus(
                "Notification sent successfully"
            );

            loadNotifications();

        } catch (error) {

            console.log(error);

            setNotificationStatus(
                "Failed to send notification"
            );

        }
    };


    // =========================
    // DELETE NOTIFICATION
    // =========================

    const deleteNotification = async (
        notificationId: number
    ) => {

        try {

            await api.delete(
                `/notifications/${notificationId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            setNotifications(
                previous =>
                    previous.filter(
                        notification =>
                            notification.id !==
                            notificationId
                    )
            );

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (
        status: string
    ) => {

        return status
            .toLowerCase()
            .replace("_", "_");

    };


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
                    onClick={onBack}
                >
                    ← Back to Projects
                </button>

            </header>


            <main className="projects-container">

                {/* =========================
                    PROJECT HEADER
                ========================= */}

                <div className="project-details-header">

                    <h2>
                        {project.name}
                    </h2>

                    <p>
                        {project.description}
                    </p>

                </div>


                {/* =========================
                    DASHBOARD
                ========================= */}

                <section className="details-section">

                    <div className="section-title-row">

                        <div>

                            <h2>
                                📊 Project Dashboard
                            </h2>

                            <p>
                                Overview of project progress
                            </p>

                        </div>

                    </div>


                    <div className="dashboard-grid">

                        <div className="dashboard-card">

                            <h3>
                                Total Tasks
                            </h3>

                            <strong>
                                {dashboard?.totalTasks ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                To Do
                            </h3>

                            <strong>
                                {dashboard?.todoTasks ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                In Progress
                            </h3>

                            <strong>
                                {dashboard?.inProgressTasks ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                Completed
                            </h3>

                            <strong>
                                {dashboard?.completedTasks ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-card">

                            <h3>
                                Members
                            </h3>

                            <strong>
                                {dashboard?.totalMembers ?? 0}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    TASKS
                ========================= */}

                <section className="details-section">

                    <div className="section-title-row">

                        <div>

                            <h2>
                                📋 Tasks
                            </h2>

                            <p>
                                Manage project tasks
                            </p>

                        </div>


                        <button
                            className="new-task-button"
                            onClick={() => {

                                if (showTaskForm) {

                                    cancelTaskForm();

                                } else {

                                    setShowTaskForm(true);

                                    setEditingTaskId(null);

                                }

                            }}
                        >
                            + New Task
                        </button>

                    </div>


                    {/* TASK FORM */}

                    {showTaskForm && (

                        <div className="create-task-form">

                            <h3>
                                {editingTaskId !== null
                                    ? "Edit Task"
                                    : "Create New Task"}
                            </h3>


                            <input
                                type="text"
                                placeholder="Task Title"
                                value={taskTitle}
                                onChange={(e) =>
                                    setTaskTitle(
                                        e.target.value
                                    )
                                }
                            />


                            <textarea
                                placeholder="Task Description"
                                value={taskDescription}
                                onChange={(e) =>
                                    setTaskDescription(
                                        e.target.value
                                    )
                                }
                            />


                            <select
                                value={taskStatus}
                                onChange={(e) =>
                                    setTaskStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="TODO">
                                    TODO
                                </option>

                                <option value="IN_PROGRESS">
                                    IN PROGRESS
                                </option>

                                <option value="COMPLETED">
                                    COMPLETED
                                </option>

                            </select>


                            <input
                                type="number"
                                placeholder="Assigned User ID"
                                value={assignedUserId}
                                onChange={(e) =>
                                    setAssignedUserId(
                                        e.target.value
                                    )
                                }
                            />


                            {taskMessage && (

                                <p className="form-error">
                                    {taskMessage}
                                </p>

                            )}


                            <div className="form-buttons">

                                <button
                                    className="create-button"
                                    onClick={
                                        editingTaskId !== null
                                            ? updateTask
                                            : createTask
                                    }
                                >
                                    {editingTaskId !== null
                                        ? "Update Task"
                                        : "Create Task"}
                                </button>


                                <button
                                    className="cancel-button"
                                    onClick={
                                        cancelTaskForm
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    )}


                    {/* TASK LIST */}

                    <div className="task-list">

                        {tasks.length === 0 ? (

                            <p className="no-comments">
                                No tasks found.
                            </p>

                        ) : (

                            tasks.map(task => (

                                <div
                                    className="task-card"
                                    key={task.id}
                                >

                                    <div className="task-card-header">

                                        <h3>
                                            {task.title}
                                        </h3>

                                        <span
                                            className={`status-badge ${getStatusClass(task.status)}`}
                                        >
                                            {task.status}
                                        </span>

                                    </div>


                                    <p>
                                        {task.description}
                                    </p>


                                    <div className="task-meta">

                                        <span>
                                            Task ID: {task.id}
                                        </span>

                                        <span>
                                            Assigned User:{" "}
                                            {task.assignedUserId || "Not assigned"}
                                        </span>

                                    </div>


                                    <div className="task-actions">

                                        <select
                                            value={task.status}
                                            onChange={(e) =>
                                                changeTaskStatus(
                                                    task,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="TODO">
                                                TODO
                                            </option>

                                            <option value="IN_PROGRESS">
                                                IN PROGRESS
                                            </option>

                                            <option value="COMPLETED">
                                                COMPLETED
                                            </option>

                                        </select>


                                        <button
                                            className="edit-task-button"
                                            onClick={() =>
                                                startEditTask(task)
                                            }
                                        >
                                            ✏ Edit
                                        </button>


                                        <button
                                            className="delete-task-button"
                                            onClick={() =>
                                                deleteTask(task.id)
                                            }
                                        >
                                            🗑 Delete
                                        </button>

                                    </div>


                                    {/* COMMENTS */}

                                    <div className="comments-section">

                                        <h4>
                                            💬 Comments
                                        </h4>


                                        {(!comments[task.id] ||
                                            comments[task.id].length === 0) ? (

                                            <p className="no-comments">
                                                No comments yet.
                                            </p>

                                        ) : (

                                            comments[task.id].map(
                                                comment => (

                                                    <div
                                                        className="comment-card"
                                                        key={comment.id}
                                                    >

                                                        <div>

                                                            <strong>
                                                                User{" "}
                                                                {comment.userId}
                                                            </strong>

                                                            <p>
                                                                {comment.message}
                                                            </p>

                                                        </div>


                                                        <button
                                                            className="delete-comment-button"
                                                            onClick={() =>
                                                                deleteComment(
                                                                    comment.id,
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                )
                                            )

                                        )}


                                        <div className="comment-form">

                                            <input
                                                type="number"
                                                placeholder="User ID"
                                                value={
                                                    commentUserIds[
                                                        task.id
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    setCommentUserIds(
                                                        previous => ({
                                                            ...previous,
                                                            [task.id]:
                                                                e.target.value
                                                        })
                                                    )
                                                }
                                            />


                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={
                                                    commentInputs[
                                                        task.id
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    setCommentInputs(
                                                        previous => ({
                                                            ...previous,
                                                            [task.id]:
                                                                e.target.value
                                                        })
                                                    )
                                                }
                                            />


                                            <button
                                                onClick={() =>
                                                    addComment(
                                                        task.id
                                                    )
                                                }
                                            >
                                                Add Comment
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </section>


                {/* =========================
                    MEMBERS
                ========================= */}

                <section className="details-section">

                    <div className="section-title-row">

                        <div>

                            <h2>
                                👥 Project Members
                            </h2>

                            <p>
                                Add users to this project
                            </p>

                        </div>

                    </div>


                    <div className="add-member-form">

                        <input
                            type="number"
                            placeholder="User ID"
                            value={memberUserId}
                            onChange={(e) =>
                                setMemberUserId(
                                    e.target.value
                                )
                            }
                        />


                        <button
                            className="add-member-button"
                            onClick={addMember}
                        >
                            + Add Member
                        </button>

                    </div>


                    {memberMessage && (

                        <p className="notification-status">
                            {memberMessage}
                        </p>

                    )}


                    <div className="members-list">

                        {members.length === 0 ? (

                            <p className="no-comments">
                                No members found.
                            </p>

                        ) : (

                            members.map(member => (

                                <div
                                    className="member-card"
                                    key={member.id}
                                >

                                    <strong>
                                        👤 User {member.userId}
                                    </strong>

                                    <p>
                                        Project ID:{" "}
                                        {member.projectId}
                                    </p>

                                </div>

                            ))

                        )}

                    </div>

                </section>


                {/* =========================
                    NOTIFICATIONS
                ========================= */}

                <section className="details-section">

                    <div className="section-title-row">

                        <div>

                            <h2>
                                🔔 Notifications
                            </h2>

                            <p>
                                Send and manage user notifications
                            </p>

                        </div>

                    </div>


                    <div className="notification-form">

                        <input
                            type="number"
                            placeholder="User ID"
                            value={notificationUserId}
                            onChange={(e) =>
                                setNotificationUserId(
                                    e.target.value
                                )
                            }
                        />


                        <button
                            className="load-notification-button"
                            onClick={loadNotifications}
                        >
                            View Notifications
                        </button>

                    </div>


                    <div className="notification-create">

                        <input
                            type="text"
                            placeholder="Notification message"
                            value={notificationMessage}
                            onChange={(e) =>
                                setNotificationMessage(
                                    e.target.value
                                )
                            }
                        />


                        <button
                            className="add-notification-button"
                            onClick={createNotification}
                        >
                            + Send Notification
                        </button>

                    </div>


                    {notificationStatus && (

                        <p className="notification-status">
                            {notificationStatus}
                        </p>

                    )}


                    <div className="notification-list">

                        {notifications.length === 0 ? (

                            <p className="no-notifications">
                                No notifications found.
                            </p>

                        ) : (

                            notifications.map(
                                notification => (

                                    <div
                                        className="notification-card"
                                        key={notification.id}
                                    >

                                        <div>

                                            <strong>
                                                🔔 Notification
                                            </strong>

                                            <p>
                                                {notification.message}
                                            </p>

                                            <span>
                                                User ID:{" "}
                                                {notification.userId}
                                            </span>

                                        </div>


                                        <button
                                            className="delete-notification-button"
                                            onClick={() =>
                                                deleteNotification(
                                                    notification.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* =========================
                    REAL TIME MESSAGE
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

export default ProjectDetails;
