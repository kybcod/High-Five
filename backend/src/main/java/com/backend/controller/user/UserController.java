package com.backend.controller.user;

import com.backend.config.PrincipalDetails;
import com.backend.domain.user.User;
import com.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String emailPattern = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";

        if (!email.trim().matches(emailPattern)) {
            return ResponseEntity.ok().build();
        }
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

    @PreAuthorize("@CustomAuth.isSelf(#id)")
    @GetMapping("/users/auth:{id}")
    public ResponseEntity getAuth(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();

        String email = principal.getUsername();
        String nickName = principal.getName();
        String password = principal.getPassword();
        boolean isLocked = principal.isAccountNonLocked();
        System.out.println("id = " + id);
        System.out.println("email = " + email);
        System.out.println("nickName = " + nickName);
        System.out.println("password = " + password);
        System.out.println("isLocked = " + isLocked);
        System.out.println("실행중");
        return null;
    }
}
