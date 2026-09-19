package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Notification;
import com.example.demo.service.NotificationService;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public Notification createNotification(
            @RequestBody Notification notification) {

        return service.createNotification(notification);
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId) {

        return service.getUserNotifications(userId);
    }

    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {

        service.deleteNotification(id);

        return "Notification deleted successfully";
    }
}