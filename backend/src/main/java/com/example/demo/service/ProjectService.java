package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Project;
import com.example.demo.repository.ProjectRepository;

@Service
public class ProjectService {

    private ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public Project createProject(Project project) {
        return repository.save(project);
    }

    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return repository.findById(id);
    }

    public Project updateProject(Long id, Project project) {

        Project existingProject = repository.findById(id).orElse(null);

        if (existingProject != null) {

            existingProject.setName(project.getName());
            existingProject.setDescription(project.getDescription());

            return repository.save(existingProject);
        }

        return null;
    }
    
    public void deleteProject(Long id) {
        repository.deleteById(id);
    }
}