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
            SELECT qb.id,qb.user_id,qb.question_id,qb.content,qb.inserted,user.nick_name FROM question_board_comment qb
                                               JOIN user ON qb.user_id = user.id WHERE question_id=#{questionId}
            """)
    List<QuestionComment> getComment(Integer questionId);

    @Delete("""
            DELETE FROM question_board_comment WHERE id=#{id}
            """)
    int deleteComment(Integer id);

    @Delete("""
            DELETE FROM question_board_comment WHERE question_id=#{questionId}
            """)
    int deleteCommentByQuestionId(Integer questionId);

    @Select("""
            SELECT * FROM question_board_comment WHERE id=#{id}
            """)
    QuestionComment selectUserById(Integer id);

    @Update("""
            UPDATE question_board_comment SET content=#{content} WHERE id=#{id}
            """)
    int updateById(String content, Integer id);
}
