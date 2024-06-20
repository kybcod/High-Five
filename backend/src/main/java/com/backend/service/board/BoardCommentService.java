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
        // 우선, 댓글의 대댓글(첫번째 대댓글)만 작성할 수 있는 기능부터
        boardComment.setCommentId(1);

//        int sequence = 0;
//        sequence++;
//        boardComment.setCommentSeq(sequence);
        int maxSeq = mapper.getMaxCommentSeq(boardComment.getBoardId());
        boardComment.setCommentSeq(maxSeq + 1);


        if (boardComment.getRefId() == null || boardComment.getCommentId() == null || boardComment.getCommentSeq() == null) {
            boardComment.setRefId(0);
            boardComment.setCommentId(0);
            boardComment.setCommentSeq(0);
        }

        System.out.println(boardComment.getCommentId());
        System.out.println(boardComment.getCommentSeq());
        System.out.println(boardComment.getRefId());
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

    public void modify(String content, Integer id) {
        mapper.updateByCommentId(content, id);
    }
}
