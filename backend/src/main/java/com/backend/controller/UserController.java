package com.backend.controller;

import com.backend.domain.User;
import com.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("users")
    public void addUser(@RequestBody User user) {


        service.addUser(user);
    }

    // TODO. 나중에 활성화
    @GetMapping("users/code")
    public void sendCode(@RequestBody User user) {

        String phoneNumber = user.getPhoneNumber();
        user.setPhoneNumber(phoneNumber);

        String verificationCode = service.sendMessage(phoneNumber);
        // TODO. 인증 확인 API 분리
        service.checkVerificationCode(verificationCode, "");
    }
}
