package com.backend.mapper.Question;

import com.backend.domain.Question.Question;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface QuestionMapper {

    @Insert("""
            INSERT INTO question_board(title,content,user_id) VALUES (#{title},#{content},#{userId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Question question);


    @Insert("""
            Insert Into question_board_file(question_id, file_name) VALUES (#{questionId},#{fileName})
            """)
    int insertFileName(Integer questionId, String fileName);

    @Select("""
            SELECT qb.id, qb.title, qb.inserted, user.nick_name
            FROM question_board qb
                     JOIN user
            WHERE qb.user_id = user.id;
            """)
    List<Question> getList();
}
