package com.example.demo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.DashboardService;

@RestController
@RequestMapping("/projects")
public class DashboardController {

    private DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/{projectId}/dashboard")
    public Map<String, Object> getDashboard(
            @PathVariable Long projectId) {

        return service.getDashboard(projectId);
    }
}