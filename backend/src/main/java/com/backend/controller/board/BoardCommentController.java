package com.backend.controller.board;

import com.backend.domain.board.BoardComment;
import com.backend.service.board.BoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardCommentController {

    final BoardCommentService service;

    @PostMapping("comment")
    public ResponseEntity addComment(@RequestBody BoardComment boardComment, Authentication authentication) {
        if (service.validate(boardComment)) {
            service.add(boardComment, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
