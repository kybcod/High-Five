package com.backend.controller.question;

import com.backend.domain.question.QuestionComment;
import com.backend.service.question.QuestionCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question/comment")
public class QuestionCommentController {
    private final QuestionCommentService service;

    @PostMapping("")
    public void add(@RequestBody QuestionComment comment, Authentication authentication) {
        service.addComment(comment, authentication);
    }

    @GetMapping("{questionId}")
    public List<QuestionComment> getComments(@PathVariable Integer questionId) {
        return service.get(questionId);
    }

    @DeleteMapping("{questionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer questionId, Authentication authentication) {
        if (service.hasAccess(questionId, authentication)) {
            service.delete(questionId);
            return ResponseEntity.ok().build();
        } else {
            System.out.println("authentication = " + authentication);
            return ResponseEntity.badRequest().build();
        }
    }
}
