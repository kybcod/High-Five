package com.backend.mapper.question;

import com.backend.domain.question.QuestionComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionCommentMapper {

    @Insert("""
            INSERT INTO question_board_comment(question_id,user_id,content) VALUES (#{questionId},#{userId},#{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertComment(QuestionComment comment);

    @Select("""
            SELECT id,user_id,question_id,content,inserted FROM question_board_comment WHERE question_id=#{questionId}
            """)
    List<QuestionComment> getComment(Integer questionId);

    @Delete("""
            DELETE FROM question_board_comment WHERE question_id=#{questionId}
            """)
    int deleteComment(Integer questionId);

    @Select("""
            SELECT * FROM question_board_comment WHERE question_id=#{questionId}
            """)
    QuestionComment selectUserId(Integer questionId);
}
