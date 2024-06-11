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
            SELECT qb.id, qb.title,user.nick_name as nickName, qb.inserted
            FROM question_board qb
                     JOIN user
            ON qb.user_id = user.id ORDER BY qb.id DESC;
            """)
    List<Question> getList(Integer page);

    @Select("""
            SELECT qb.id, qb.title, qb.content, qb.inserted, user.nick_name nickName FROM question_board qb JOIN user ON qb.user_id = user.id WHERE qb.id = #{id}
            """)
    Question selectById(Integer id);

    @Select("""
            SELECT file_name FROM question_board_file WHERE question_id=#{id}
            """)
    List<String> selectFileByQuestionId(Integer id);

    @Select("""
            <script>
                SELECT qb.id, qb.title, user.nick_name as nickName, qb.inserted
                FROM question_board qb
                JOIN user ON qb.user_id = user.id
                <where>
                    <if test="searchType != null and keyword != null and keyword != ''">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'titleNickName'">
                            (qb.title LIKE #{pattern} OR user.nick_name LIKE #{pattern})
                        </if>
                        <if test="searchType == 'title'">
                            qb.title LIKE #{pattern}
                        </if>
                        <if test="searchType == 'nickName'">
                            user.nick_name LIKE #{pattern}
                        </if>
                    </if>
                </where>
                ORDER BY qb.id DESC
                LIMIT 10 OFFSET #{offset}
            </script>
            """)
    List<Question> selectAllPaging(Integer offset, String searchType, String keyword);

    @Select("""
            <script>
                SELECT COUNT(qb.id)
                FROM question_board qb
                JOIN user ON qb.user_id = user.id
                <where>
                    <if test="searchType != null and keyword != null and keyword != ''">
                        <bind name="pattern" value="'%' + keyword + '%'" />
                        <if test="searchType == 'titleNickName'">
                            (qb.title LIKE #{pattern} OR user.nick_name LIKE #{pattern})
                        </if>
                        <if test="searchType == 'title'">
                            qb.title LIKE #{pattern}
                        </if>
                        <if test="searchType == 'nickName'">
                            user.nick_name LIKE #{pattern})
                        </if>
                    </if>
                </where>
            </script>
                """)
    Integer countAllWithSearch(String searchType, String keyword);
}
