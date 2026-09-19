package com.example.demo.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.repository.ProjectMemberRepository;
import com.example.demo.repository.TaskRepository;

@Service
public class DashboardService {

    private TaskRepository taskRepository;

    private ProjectMemberRepository memberRepository;

    public DashboardService(
            TaskRepository taskRepository,
            ProjectMemberRepository memberRepository) {

        this.taskRepository = taskRepository;
        this.memberRepository = memberRepository;
    }

    public Map<String, Object> getDashboard(Long projectId) {

        long totalTasks =
                taskRepository.countByProjectId(projectId);

        long todoTasks =
                taskRepository.countByProjectIdAndStatus(
                        projectId, "TODO");

        long inProgressTasks =
                taskRepository.countByProjectIdAndStatus(
                        projectId, "IN_PROGRESS");

        long completedTasks =
                taskRepository.countByProjectIdAndStatus(
                        projectId, "COMPLETED");

        long totalMembers =
                memberRepository.countByProjectId(projectId);

        Map<String, Object> dashboard =
                new LinkedHashMap<>();

        dashboard.put("projectId", projectId);
        dashboard.put("totalTasks", totalTasks);
        dashboard.put("todoTasks", todoTasks);
        dashboard.put("inProgressTasks", inProgressTasks);
        dashboard.put("completedTasks", completedTasks);
        dashboard.put("totalMembers", totalMembers);

        return dashboard;
    }
}