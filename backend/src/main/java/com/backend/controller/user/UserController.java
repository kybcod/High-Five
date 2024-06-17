package com.backend.controller.user;

import com.backend.domain.user.User;
import com.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final AuthenticationConfiguration authenticationConfiguration;

    // user_id 멤버 상세
    @PreAuthorize("isAuthenticated()")
    @GetMapping("users/{id}")
    public ResponseEntity getUser(@PathVariable Integer id) {
        User db = service.getUserByUserId(id);
        if (db != null) {
            db.setPassword("");
        }
        return ResponseEntity.ok(db);
    }

    // user 회원 가입
    @PostMapping("users")
    public ResponseEntity addUser(@RequestBody User user) {
        //TODO:나중에 주석 풀기
//        if (service.signUpVerification(user)) {
        service.addUser(user);
        return ResponseEntity.ok().build();
//        }
//        return ResponseEntity.badRequest().build();
    }

    // user 수정
    @PreAuthorize("isAuthenticated()")
    @PutMapping("users/{id}")
    public ResponseEntity updateUser(@RequestBody User user, Authentication authentication) {
        if (service.identificationToModify(user)) {
            Map<String, Object> token = service.updateUser(user, authentication);
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // user 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("users/{id}")
    public ResponseEntity removeUser(@RequestBody User user, Authentication authentication) {
        if (service.identificationToDelete(user, authentication)) {
            service.removeUserById(user.getId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 회원가입 시 인증코드 받기
    // TODO. 나중에 활성화
    @GetMapping("users/codes")
    public void sendCode(String phoneNumber) {
        String verificationCode = service.sendMessage(phoneNumber);
//         TODO. 인증 확인 API 분리
        service.checkVerificationCode(verificationCode, "");
    }

    // user 로그인
    @PostMapping("users/login")
    public ResponseEntity login(@RequestBody User user) {
        Map<String, Object> token = service.issueToken(user);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(token);
    }

    // 회원가입 시 email 중복 확인
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

    // 회원가입 시 닉네임 중복 확인
    @GetMapping("/users/nickNames")
    public ResponseEntity nickNames(String nickName) {
        User user = service.getUserByNickName(nickName);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    // user 리스트 조회
    @GetMapping("/users/list")
    public Map<String, Object> list(@RequestParam(required = false, defaultValue = "1") int page) {
//        return service.getUserList(PageRequest.of(page - 1, 10));
        return service.getUserList(page);
    }
}
