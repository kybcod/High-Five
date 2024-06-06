package com.backend.controller;

import com.backend.domain.User;
import com.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("users")
    public void addUser(@RequestBody User user, String customerCodee) {

        // TODO. 나중에 전화번호 11자리로 바꾸고 코드 삭제
        String phoneNumber = user.getPhoneNumber().replaceAll("-", "");
        user.setPhoneNumber(phoneNumber);

        // TODO. 전화번호 보내는 API 분리
//        String verificationCode = service.sendMessage(phoneNumber);
//        service.checkVerificationCode(verificationCode, customerCodee);

        service.addUser(user);
    }
}
