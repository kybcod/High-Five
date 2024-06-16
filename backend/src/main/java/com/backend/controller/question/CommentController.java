package com.backend.controller.question;

import com.backend.domain.question.QuestionComment;
import com.backend.service.question.QuestionCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question/comment")
public class CommentController {
    private final QuestionCommentService service;

    @PostMapping("")
    public void add(@RequestBody QuestionComment comment, Authentication authentication) {
        service.addComment(comment, authentication);
    }

    @GetMapping("{questionId}")
    public List<QuestionComment> getComments(@PathVariable Integer questionId) {
        return null;
    }
}
