package com.example.demo.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.ProjectMember;
import com.example.demo.repository.ProjectMemberRepository;

@Service
public class ProjectMemberService {

    private ProjectMemberRepository repository;

    public ProjectMemberService(ProjectMemberRepository repository) {
        this.repository = repository;
    }

    public ProjectMember addMember(ProjectMember member) {
        return repository.save(member);
    }

    public List<ProjectMember> getProjectMembers(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    public void removeMember(Long id) {
        repository.deleteById(id);
    }
}