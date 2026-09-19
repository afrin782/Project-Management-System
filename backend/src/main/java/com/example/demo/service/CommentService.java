package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Comment;
import com.example.demo.repository.CommentRepository;

@Service
public class CommentService {

    private CommentRepository repository;

    public CommentService(CommentRepository repository) {
        this.repository = repository;
    }

    public Comment addComment(Comment comment) {
        return repository.save(comment);
    }

    public List<Comment> getTaskComments(Long taskId) {
        return repository.findByTaskId(taskId);
    }

    public void deleteComment(Long id) {
        repository.deleteById(id);
    }
}