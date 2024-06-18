package com.backend.mapper.board;

import com.backend.domain.board.BoardComment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardCommentMapper {

    @Insert("""
            INSERT INTO board_comment
            (board_id, user_id, content)
            VALUES (#{boardId}, #{userId}, #{content})
            """)
    void addComment(BoardComment boardComment);
}
