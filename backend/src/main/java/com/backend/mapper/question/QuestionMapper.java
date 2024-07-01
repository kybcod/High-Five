package com.backend.mapper.question;

import com.backend.domain.question.Faq;
import com.backend.domain.question.FaqCategory;
import com.backend.domain.question.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionMapper {

    @Insert("""
            INSERT INTO question_board( title,content,user_id,secret_write) VALUES (#{title},#{content},#{userId},#{secretWrite})
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
            SELECT qb.id, qb.title, qb.content, qb.inserted, user.nick_name nickName, qb.user_id, qb.secret_write FROM question_board qb JOIN user ON qb.user_id = user.id WHERE qb.id = #{id}
            """)
    Question selectById(Integer id);

    @Select("""
            SELECT file_name FROM question_board_file WHERE question_id=#{id} ORDER BY id;
            """)
    List<String> selectFileByQuestionId(Integer id);

    @Select("""
            <script>
                SELECT qb.id, qb.title, user.nick_name as nickName, user.id as userId, qb.number_of_count, qb.inserted, qb.secret_write,
                       qbf.numberOfFiles,
                       qbc.numberOfComments
                FROM question_board qb
                JOIN user ON qb.user_id = user.id
                     LEFT JOIN (SELECT question_id, COUNT(*) AS numberOfFiles
                                                   FROM question_board_file
                                                   GROUP BY question_id) qbf ON qb.id = qbf.question_id
                        LEFT JOIN (SELECT question_id, COUNT(*) AS numberOfComments
                                                      FROM question_board_comment
                                                      GROUP BY question_id) qbc ON qb.id= qbc.question_id
                    <trim prefix="WHERE" prefixOverrides="OR">
                        <if test="searchType != null">
                            <bind name="pattern" value="'%' + keyword + '%'" />
                            <if test="searchType == 'titleNick' || searchType == 'title'">
                                OR qb.title LIKE #{pattern}
                            </if>
                            <if test="searchType == 'titleNick' || searchType == 'nickName'">
                                OR user.nick_name LIKE #{pattern}
                            </if>
                        </if>
                    </trim>
                GROUP BY qb.id
                ORDER BY qb.id DESC
                LIMIT #{offset},10
            </script>
            """)
    List<Question> selectUsingPageable(int offset, String searchType, String keyword);

    @Select("""
            <script>
                SELECT COUNT(qb.id)
                FROM question_board qb
                JOIN user ON qb.user_id = user.id
                    <trim prefix="WHERE" prefixOverrides="OR">
                        <if test="searchType != null">
                            <bind name="pattern" value="'%' + keyword + '%'" />
                            <if test="searchType == 'titleNick' || searchType == 'title'">
                                OR qb.title LIKE #{pattern}
                            </if>
                            <if test="searchType == 'titleNick' || searchType == 'nickName'">
                                OR user.nick_name LIKE #{pattern}
                            </if>
                        </if>
                    </trim>
            </script>
            """)
    int countAllWithSearch(String searchType, String keyword);

    @Delete("""
            DELETE FROM question_board WHERE id=#{id}
            """)
    void deleteById(Integer id);

    @Delete("""
            DELETE FROM question_board_file WHERE question_id=#{id}
            """)
    void deleteByIdFile(Integer id);

    @Update("""
            UPDATE question_board SET title=#{title}, content=#{content}, secret_write=#{secretWrite} WHERE id=#{id}
            """)
    void updateById(Question question);

    @Delete("""
            DELETE FROM question_board_file WHERE question_id=#{id} AND file_name=#{name}
            """)
    void deleteFileByIdAndFileName(Integer id, String name);

    @Update("""
            UPDATE question_board SET number_of_count = number_of_count+1 WHERE id=#{id}
            """)
    int updateCountById(Integer id);

    @Select("SELECT * FROM faq WHERE category=#{category} OR #{category}='all'")
    List<Faq> getFaqList(String category);

    @Select("SELECT * FROM faqCategory")
    List<FaqCategory> getAllCategories();

    @Select("""
            SELECT id prevId, title prevTitle, secret_write prevSecret, user_id prevUserId FROM question_board WHERE id<#{id} ORDER BY id DESC LIMIT 1;
            """)
    Question getPrevId(Integer id);

    @Select("""
            SELECT id nextId, title nextTitle, secret_write nextSecret, user_id nextUserId FROM question_board WHERE id>#{id} ORDER BY id ASC LIMIT 1;
            """)
    Question getNextId(Integer id);
}
