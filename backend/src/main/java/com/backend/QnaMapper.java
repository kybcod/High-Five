package com.backend;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QnaMapper {

    @Insert("""
INSERT INTO question_board(user_id,title,content) VALUES (#{userId},#{title},#{content})
""")
    int insert(Qna qna);
}
