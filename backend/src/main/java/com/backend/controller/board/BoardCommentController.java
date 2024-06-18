package com.backend.controller.board;

import com.backend.domain.board.BoardComment;
import com.backend.service.board.BoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/comment")
@RequiredArgsConstructor
public class BoardCommentController {

    final BoardCommentService service;

    @PostMapping
    public ResponseEntity addComment(@RequestBody BoardComment boardComment, Authentication authentication) {
        if (service.validate(boardComment)) {
            service.add(boardComment, authentication);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("{boardId}")
    public List<BoardComment> commentList(@PathVariable Integer boardId) {
        System.out.println(boardId);
        return service.commentList(boardId);
    }
}
