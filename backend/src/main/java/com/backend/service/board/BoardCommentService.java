package com.backend.service.board;

import com.backend.domain.board.BoardComment;
import com.backend.mapper.board.BoardCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public List<BoardComment> commentList(Integer boardId) {
        List<BoardComment> boardCommentList = mapper.selectAllComment(boardId);

        return boardCommentList;
    }

    public boolean hasAccess(BoardComment boardComment, Authentication authentication) {
        // 작성자만 삭제, 수정 가능함
        Integer userId = boardComment.getUserId();
        BoardComment accessId = mapper.selectById(boardComment.getId());

        if (accessId == null) {
            return false;
        }
        if (!authentication.getName().equals(userId.toString())) {
            return false;
        }
        return true;
    }

    public void deleteComment(BoardComment boardComment) {
        mapper.deleteByCommentId(boardComment.getId());
    }

    public BoardComment getCommentById(Integer id) {
        return mapper.selectById(id);
    }

    public void modify(BoardComment boardComment) {
        mapper.updateByCommentId(boardComment);
        System.out.println(boardComment);
    }
}
