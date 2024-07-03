package com.backend.controller.question;

import com.backend.domain.question.Faq;
import com.backend.domain.question.FaqCategory;
import com.backend.domain.question.Question;
import com.backend.service.question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question")
public class QuestionController {
    private final QuestionService service;

    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity add(Question question,
                              @RequestParam(value = "files[]", required = false) MultipartFile[] files,
                              Authentication authentication
    ) throws IOException {
//         인증 객체가 null이거나 인증되지 않은 경우 403 응답 반환
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
        }
        if (service.validate(question)) {
            service.add(question, files, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("list")
    public Map<String, Object> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(value = "type", required = false) String searchType,
            @RequestParam(value = "keyword", defaultValue = "") String keyword) {
        return service.list(page, searchType, keyword);
    }

    @GetMapping("{id}")
    public ResponseEntity getQuestion(@PathVariable Integer id, Authentication authentication) {
        Question question = service.get(id);
        if (question.getSecretWrite()) {
            if (service.hasAccess(id, authentication) || authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("SCOPE_admin"))) {
                return ResponseEntity.ok().body(question);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().body(question);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer id, Authentication authentication) {
        if (service.hasAccess(id, authentication) || authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("SCOPE_admin"))) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PutMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity update(@PathVariable Integer id, Question question, Authentication authentication,
                                 @RequestParam(required = false, value = "addFileList[]") MultipartFile[] addFileList,
                                 @RequestParam(required = false, value = "removeFileList[]") List<String> removeFileList
    ) throws IOException {
        if (!service.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (service.validate(question)) {
            service.edit(question, addFileList, removeFileList);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("faq")
    @Description("faq 카테고리")
    public Map<String, Object> getFaq(@RequestParam(defaultValue = "all") String category) {
        List<Faq> faqList = service.getFaq(category);
        List<FaqCategory> categories = service.getAllCategories();
        Map<String, Object> response = new HashMap<>();
        response.put("faqList", faqList);
        response.put("categories", categories);
        return response;
    }

    @GetMapping("/user/{userId}")
    public Map<String, Integer> count(@PathVariable Integer userId) {
        System.out.println("userId = " + userId);
        return service.getQuestionCount(userId);
    }
}
