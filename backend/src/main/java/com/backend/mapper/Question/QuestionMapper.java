package com.backend.mapper.Question;

import com.backend.domain.Question.Question;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface QuestionMapper {

    @Insert("""
            INSERT INTO question_board(user_id,title,content) VALUES (#{userId},#{title},#{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Question question);


    @Insert("""
            Insert Into question_board_file(question_id, file_name) VALUES (#{questionId},#{fileName})
            """)
    int insertFileName(Integer questionId, String fileName);
}
