package com.backend.controller.question;

import com.backend.domain.question.QuestionComment;
import com.backend.service.question.QuestionCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question/comment")
public class QuestionCommentController {
    private final QuestionCommentService service;

    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public void add(@RequestBody QuestionComment comment, Authentication authentication) {
        service.addComment(comment, authentication);
    }

    @GetMapping("{questionId}")
    public List<QuestionComment> getComments(@PathVariable Integer questionId) {
        return service.get(questionId);
    }

    @DeleteMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@RequestBody Map<String, Integer> request, Authentication authentication) {
        Integer id = request.get("id");
        System.out.println("id = " + id);
        if (id == null) {
            return ResponseEntity.badRequest().body("ID is required");
        }
        if (service.hasAccess(id, authentication)) {
            service.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(QuestionComment comment, Authentication authentication) {
        if (service.hasAccess(comment.getId(), authentication)) {
            service.edit(comment.getId());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
