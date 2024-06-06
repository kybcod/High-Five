package com.backend.controller;

import com.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("users")
    public void addUser(@RequestBody Map<String, String> user, String phoneNumber) {
        System.out.println("email = " + user.get("email"));
        System.out.println("password = " + user.get("password"));
        System.out.println("nickName = " + user.get("nickName"));
        System.out.println("phoneNumber = " + user.get("phoneNumber"));
    }
}
