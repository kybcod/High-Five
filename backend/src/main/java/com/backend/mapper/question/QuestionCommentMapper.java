package com.backend.mapper.question;

import com.backend.domain.question.QuestionComment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface QuestionCommentMapper {

    @Insert("""
            INSERT INTO question_board_comment(question_id,user_id,content) VALUES (#{questionId},#{userId},#{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertComment(QuestionComment comment);
}
