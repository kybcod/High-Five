package com.backend.mapper.Question;

import com.backend.domain.Question.Question;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionMapper {

    @Insert("""
INSERT INTO question_board(user_id,title,content) VALUES (#{userId},#{title},#{content})
""")
    int insert(Question question);
}
