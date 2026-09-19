package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Project;
import com.example.demo.service.ProjectService;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return service.createProject(project);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return service.getAllProjects();
    }

    @GetMapping("/{id}")
    public Optional<Project> getProjectById(@PathVariable Long id) {
        return service.getProjectById(id);
    }
    
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {

        return service.updateProject(id, project);
    }
    
    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {

        service.deleteProject(id);

        return "Project deleted successfully";
    }
    
}