package com.backend.mapper.board;

import com.backend.domain.board.BoardComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardCommentMapper {

    @Insert("""
            INSERT INTO board_comment
            (board_id, user_id, content, comment_id, comment_sequence, reference_id)
            VALUES (#{boardId}, #{userId}, #{content}, #{commentId}, #{commentSeq}, #{refId})
            """)
    void addComment(BoardComment boardComment);

    @Select("""
            SELECT COALESCE(MAX(comment_sequence), 0)
            FROM board_comment
            WHERE board_id = #{boardId}
            """)
    int getMaxCommentSeq(int boardId);

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

    @Update("""
            UPDATE board_comment
            SET content = #{content}, inserted = NOW()
            WHERE id = #{id}
            """)
    void updateByCommentId(String content, Integer id);
}
