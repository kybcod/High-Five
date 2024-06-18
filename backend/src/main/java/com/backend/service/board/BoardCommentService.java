package com.backend.service.board;

import com.backend.domain.board.BoardComment;
import com.backend.mapper.board.BoardCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardCommentService {

    final BoardCommentMapper mapper;

    public boolean validate(BoardComment boardComment) {
        if (boardComment == null) {
            return false;
        }

        if (boardComment.getContent().isBlank()) {
            return false;
        }

        if (boardComment.getBoardId() == null) {
            return false;
        }
        return true;
    }

    public void add(BoardComment boardComment, Authentication authentication) {
        boardComment.setUserId(Integer.valueOf(authentication.getName()));

        mapper.addComment(boardComment);
    }
}
