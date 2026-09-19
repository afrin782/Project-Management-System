package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.ProjectMember;
import com.example.demo.service.ProjectMemberService;

@RestController
@RequestMapping("/project-members")
public class ProjectMemberController {

    private ProjectMemberService service;

    public ProjectMemberController(ProjectMemberService service) {
        this.service = service;
    }

    @PostMapping
    public ProjectMember addMember(@RequestBody ProjectMember member) {
        return service.addMember(member);
    }

    @GetMapping("/project/{projectId}")
    public List<ProjectMember> getProjectMembers(
            @PathVariable Long projectId) {

        return service.getProjectMembers(projectId);
    }

    @DeleteMapping("/{id}")
    public String removeMember(@PathVariable Long id) {

        service.removeMember(id);

        return "Member removed successfully";
    }
}