package com.backend.mapper.Board;

import com.backend.domain.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board (title, content)
            VALUES (#{title}, #{content})
            """)
    public int insert(Board board);
}
