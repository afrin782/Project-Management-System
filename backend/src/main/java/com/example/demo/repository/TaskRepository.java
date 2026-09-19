package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedUserId(Long assignedUserId);

    long countByProjectId(Long projectId);

    long countByProjectIdAndStatus(Long projectId, String status);
}