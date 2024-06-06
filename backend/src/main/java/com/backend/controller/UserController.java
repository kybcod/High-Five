package com.backend.controller;

import com.backend.service.user.UserService;
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
    public void addUser(@RequestBody Map<String, String> user, String phoneNumber, String customerCodee) {

        String verificationCode = service.sendMessage(phoneNumber);
        service.checkVerificationCode(verificationCode, customerCodee);
    }
}
