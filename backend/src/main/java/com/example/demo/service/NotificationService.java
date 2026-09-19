package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Notification;
import com.example.demo.repository.NotificationRepository;

@Service
public class NotificationService {

    private NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public Notification createNotification(Notification notification) {
        return repository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return repository.findByUserId(userId);
    }

    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }
}
