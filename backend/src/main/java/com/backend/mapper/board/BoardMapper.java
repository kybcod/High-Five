package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board ( title, user_id, content)
            VALUES (#{title}, #{userId}, #{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Board board);

    @Insert("""
            INSERT INTO board_file (board_id, file_name)
            VALUES (#{boardId}, #{fileName})
            """)
    void insertFileName(Integer boardId, String fileName);

    @Select("""
            SELECT id, title, user_id, inserted
            FROM board
            ORDER BY id DESC
            """)
    List<Board> selectAll();

    @Select("""
            SELECT id, title, user_id, inserted, content
            FROM board
            WHERE id = #{id}
            """)
    Board selectById(Integer id);

    @Update("""
            UPDATE board
            SET id = #{id}, title = #{title}, content = #{content}
            WHERE id = #{id}
            """)
    int update(Board board);

    @Delete("""
            DELETE FROM board
            WHERE id = #{id}
            """)
    int deleteById(Integer id);

    @Select("""
            SELECT file_name FROM board_file
            WHERE board_id = #{boardId}
            """)
    List<String> selectFileNameByBoardId(Integer boardId);

    @Delete("""
            DELETE FROM board_file
            WHERE board_id = #{boardId}
            AND file_name = #{fileName}
            """)
    void deleteFileByBoardIdAndName(Integer boardId, String fileName);
}
