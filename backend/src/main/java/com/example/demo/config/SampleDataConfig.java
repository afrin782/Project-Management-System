package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Comment;
import com.example.demo.entity.Notification;
import com.example.demo.entity.Project;
import com.example.demo.entity.ProjectMember;
import com.example.demo.entity.Task;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.ProjectMemberRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.TaskRepository;

@Component
public class SampleDataConfig implements CommandLineRunner {

    private ProjectRepository projectRepository;
    private TaskRepository taskRepository;
    private ProjectMemberRepository memberRepository;
    private CommentRepository commentRepository;
    private NotificationRepository notificationRepository;

    public SampleDataConfig(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            ProjectMemberRepository memberRepository,
            CommentRepository commentRepository,
            NotificationRepository notificationRepository) {

        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.memberRepository = memberRepository;
        this.commentRepository = commentRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {

        addProject(
                "Website Redesign",
                "Redesign and develop a modern responsive company website.",
                1
        );

        addProject(
                "Mobile Banking App",
                "Develop a secure mobile banking application for customers.",
                2
        );

        addProject(
                "E-Commerce Platform",
                "Build an online shopping platform with products, cart and orders.",
                3
        );

        addProject(
                "Employee Management System",
                "Manage employee information, departments, attendance and roles.",
                4
        );
        
        addProject(
                "Online Learning Platform",
                "Develop an online learning platform for courses, students, lessons and progress tracking.",
                1
        );

        addProject(
                "Hospital Management System",
                "Manage patients, doctors, appointments, billing and medical records.",
                2
        );

        addProject(
                "Food Delivery Application",
                "Build a food delivery platform with restaurants, food orders, payments and delivery tracking.",
                3
        );
        
        addProject(
                "Travel Booking Platform",
                "Build a travel booking platform for hotels, flights, destinations and trip reservations.",
                4
        );
    }

    private void addProject(
            String projectName,
            String projectDescription,
            long mainUserId) {

        if (projectRepository.findAll()
                .stream()
                .anyMatch(p -> p.getName().equals(projectName))) {

            return;
        }

        // =========================
        // PROJECT
        // =========================

        Project project = new Project();

        project.setName(projectName);
        project.setDescription(projectDescription);

        Project savedProject =
                projectRepository.save(project);

        Long projectId = savedProject.getId();

        // =========================
        // MEMBERS
        // =========================

        addMember(projectId, mainUserId);
        addMember(projectId, 1);
        addMember(projectId, 2);
        addMember(projectId, 3);

        // =========================
        // TASK 1
        // =========================

        Task task1 = new Task();

        task1.setTitle("Project Planning");
        task1.setDescription(
                "Prepare project requirements and development plan."
        );
        task1.setStatus("COMPLETED");
        task1.setProjectId(projectId);
        task1.setAssignedUserId(mainUserId);

        Task savedTask1 =
                taskRepository.save(task1);

        // =========================
        // TASK 2
        // =========================

        Task task2 = new Task();

        task2.setTitle("UI Design");
        task2.setDescription(
                "Create user interface designs and application screens."
        );
        task2.setStatus("IN_PROGRESS");
        task2.setProjectId(projectId);
        task2.setAssignedUserId(2L);

        Task savedTask2 =
                taskRepository.save(task2);

        // =========================
        // TASK 3
        // =========================

        Task task3 = new Task();

        task3.setTitle("Backend Development");
        task3.setDescription(
                "Develop REST APIs and connect the application with MySQL."
        );
        task3.setStatus("TODO");
        task3.setProjectId(projectId);
        task3.setAssignedUserId(3L);

        Task savedTask3 =
                taskRepository.save(task3);

        // =========================
        // TASK 4
        // =========================

        Task task4 = new Task();

        task4.setTitle("Testing");
        task4.setDescription(
                "Test application features and fix reported issues."
        );
        task4.setStatus("TODO");
        task4.setProjectId(projectId);
        task4.setAssignedUserId(mainUserId);

        Task savedTask4 =
                taskRepository.save(task4);

        // =========================
        // COMMENTS
        // =========================

        addComment(
                savedTask1.getId(),
                1L,
                "Project requirements have been reviewed."
        );

        addComment(
                savedTask2.getId(),
                2L,
                "The initial UI design is ready for review."
        );

        addComment(
                savedTask3.getId(),
                3L,
                "Backend API development is ready to start."
        );

        addComment(
                savedTask4.getId(),
                mainUserId,
                "Testing will begin after development is completed."
        );

        // =========================
        // NOTIFICATIONS
        // =========================

        addNotification(
                mainUserId,
                "You have been added to " + projectName
        );

        addNotification(
                2L,
                "You have been assigned a task in " + projectName
        );

        addNotification(
                3L,
                "A new task is available in " + projectName
        );

        System.out.println(
                "Sample project created: " + projectName
        );
    }

    private void addMember(
            Long projectId,
            long userId) {

        ProjectMember member =
                new ProjectMember();

        member.setProjectId(projectId);
        member.setUserId(userId);

        memberRepository.save(member);
    }

    private void addComment(
            Long taskId,
            long userId,
            String message) {

        Comment comment =
                new Comment();

        comment.setTaskId(taskId);
        comment.setUserId(userId);
        comment.setMessage(message);

        commentRepository.save(comment);
    }

    private void addNotification(
            long userId,
            String message) {

        Notification notification =
                new Notification();

        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setRead(false);

        notificationRepository.save(notification);
    }
}