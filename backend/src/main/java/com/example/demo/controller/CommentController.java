package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Comment;
import com.example.demo.service.CommentService;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private CommentService service;

    public CommentController(CommentService service) {
        this.service = service;
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return service.addComment(comment);
    }

    @GetMapping("/task/{taskId}")
    public List<Comment> getTaskComments(
            @PathVariable Long taskId) {

        return service.getTaskComments(taskId);
    }

    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Long id) {

        service.deleteComment(id);

        return "Comment deleted successfully";
    }
}