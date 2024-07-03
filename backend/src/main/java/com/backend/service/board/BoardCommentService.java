package com.backend.service.board;

import com.backend.domain.board.BoardComment;
import com.backend.domain.user.UserFile;
import com.backend.mapper.board.BoardCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardCommentService {

    final BoardCommentMapper mapper;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

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

        if (boardComment.getRefId() != null && boardComment.getRefId() > 0) {
            int maxSeq = mapper.getMaxCommentSeq(boardComment.getBoardId());
            boardComment.setCommentSeq(maxSeq + 1);
            boardComment.setCommentId(boardComment.getCommentId() + 1);
        } else {
            boardComment.setCommentId(0);
        }

        mapper.addComment(boardComment);
    }

    public List<BoardComment> commentList(Integer boardId) {
        List<BoardComment> boardCommentList = mapper.selectAllComment(boardId);

        for (BoardComment boardComment : boardCommentList) {
            String fileName = mapper.selectFileNameByUserId(boardComment.getUserId());
            String src = STR."\{srcPrefix}user/\{boardComment.getUserId()}/\{fileName}";

            UserFile userFile = UserFile.builder()
                    .fileName(fileName)
                    .src(src)
                    .build();

            boardComment.setProfileImage(userFile);
        }

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
        int parId = boardComment.getId();
        mapper.deleteByCommentId(parId);

        if (boardComment.getRefId() == null) {
            mapper.deleteByChildCommentId(parId);
        }
    }

    public BoardComment getCommentById(Integer id) {
        return mapper.selectById(id);
    }

    public void modify(String content, Integer id) {
        mapper.updateByCommentId(content, id);
    }
}
