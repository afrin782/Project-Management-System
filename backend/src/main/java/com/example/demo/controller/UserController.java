package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.security.JwtUtil;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private UserService service;
    private JwtUtil jwtUtil;

    public UserController(UserService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User loggedUser = service.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        if (loggedUser != null) {
            return jwtUtil.generateToken(loggedUser.getEmail());
        }

        return "Invalid email or password";
    }
}