package com.backend.controller.User;

import com.backend.domain.User.User;
import com.backend.service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("users")
    public ResponseEntity addUser(@RequestBody User user) {
        if (service.signUpVerification(user)) {
            service.addUser(user);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    // TODO. 나중에 활성화
    @GetMapping("users/codes")
    public void sendCode(String phoneNumber) {
//        String verificationCode = service.sendMessage(phoneNumber);
        // TODO. 인증 확인 API 분리
//        service.checkVerificationCode(verificationCode, "");
    }

    @PostMapping("users/login")
    public ResponseEntity login(@RequestBody User user) {
        Map<String, Object> token = service.issueToken(user);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(token);
    }

    @GetMapping("/users/emails")
    public ResponseEntity emails(String email) {
        User user = service.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/nickNames")
    public ResponseEntity nickNames(String nickName) {
        User user = service.getUserByNickName(nickName);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
