package com.backend.mapper.Board;

import com.backend.domain.Board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board (title, content, inserted)
            VALUES (#{title}, #{content}, #{inserted})
            """)
    public int insert(Board board);

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
            SET title = #{title}, content = #{content}, inserted = #{inserted}
            WHERE id = #{id}
            """)
    int update(Integer id, Board board);
}
