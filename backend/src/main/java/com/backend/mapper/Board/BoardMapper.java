package com.backend.mapper.Board;

import com.backend.domain.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board (title, content)
            VALUES (#{title}, #{content})
            """)
    public int insert(Board board);

    @Select("""
            SELECT id, title, user_id, content
            FROM board
            ORDER BY id DESC
            """)
    List<Board> selectAll();
}
