package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Task;
import com.example.demo.repository.TaskRepository;

@Service
public class TaskService {

    private TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task createTask(Task task) {
        return repository.save(task);
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public List<Task> getProjectTasks(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    public List<Task> getAssignedTasks(Long userId) {
        return repository.findByAssignedUserId(userId);
    }

    public Task updateTask(Long id, Task task) {

        Task existingTask = repository.findById(id).orElse(null);

        if (existingTask != null) {

            existingTask.setTitle(task.getTitle());
            existingTask.setDescription(task.getDescription());
            existingTask.setStatus(task.getStatus());
            existingTask.setProjectId(task.getProjectId());
            existingTask.setAssignedUserId(task.getAssignedUserId());

            return repository.save(existingTask);
        }

        return null;
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}