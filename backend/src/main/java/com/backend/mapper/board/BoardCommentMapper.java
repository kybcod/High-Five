package com.backend.mapper.board;

import com.backend.domain.board.BoardComment;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardCommentMapper {

    @Insert("""
            INSERT INTO board_comment
            (board_id, user_id, content)
            VALUES (#{boardId}, #{userId}, #{content})
            """)
    void addComment(BoardComment boardComment);

    @Select("""
            SELECT id, board_id, user_id, content, inserted
            FROM board_comment
            WHERE board_id = #{boardId}
            """)
    List<BoardComment> selectAllComment(Integer boardId);

    @Select("""
            SELECT *
            FROM board_comment
            WHERE id = #{id}
            """)
    BoardComment selectById(Integer id);

    @Delete("""
             DELETE FROM board_comment
             WHERE id = #{id}
            """)
    void deleteByCommentId(Integer id);
}
