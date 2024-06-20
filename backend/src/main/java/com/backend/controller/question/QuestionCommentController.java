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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question/comment")
public class QuestionCommentController {
    private final QuestionCommentService service;

    @PostMapping("")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity add(@RequestBody QuestionComment comment, Authentication authentication) {
        service.addComment(comment, authentication);
        if (authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("SCOPE_admin"))) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("{questionId}")
    public List<QuestionComment> getComments(@PathVariable Integer questionId) {
        return service.get(questionId);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer id, Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            service.delete(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PutMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@PathVariable Integer id, @RequestBody QuestionComment comment, Authentication authentication) {
        if (comment == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Request body is missing or malformed.");
        }

        if (!id.equals(comment.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Path ID and Comment ID do not match.");
        }

        if (service.hasAccess(comment.getId(), authentication)) {
            service.edit(comment.getContent(), comment.getId());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
