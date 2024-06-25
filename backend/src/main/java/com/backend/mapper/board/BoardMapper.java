package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board ( title, user_id, content)
            VALUES (#{title}, #{userId}, #{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Board board);

    @Insert("""
            INSERT INTO board_file (board_id, file_name)
            VALUES (#{boardId}, #{fileName})
            """)
    void insertFileName(Integer boardId, String fileName);

    @Select("""
            <script>
            SELECT b.id,
                    b.title,
                    b.content,
                    u.nick_name nickName,
                    b.inserted,
                    COUNT(DISTINCT f.file_name) AS number_of_images,
                    COUNT(DISTINCT l.user_id) AS number_of_likes,
                    COUNT(DISTINCT c.id) AS number_of_comments
            FROM board b LEFT JOIN board_file f ON b.id = f.board_id
                         LEFT JOIN board_like l ON b.id = l.board_id
                         LEFT JOIN board_comment c ON b.id = c.board_id
                         LEFT JOIN user u ON b.user_id = u.id
            <where>
                <if test="keyword != null and keyword != ''">
                    <bind name="pattern" value="'%' + keyword + '%'"/>
                    <choose>
                        <when test="searchType == 'all'">
                            (b.title LIKE #{pattern} OR b.content LIKE #{pattern} OR u.nick_name LIKE #{pattern})
                        </when>
                        <when test="searchType == 'text'">
                            (b.title LIKE #{pattern} OR b.content LIKE #{pattern})
                        </when>
                        <when test="searchType == 'nickName'">
                            u.nick_name LIKE #{pattern}
                        </when>
                    </choose>
                </if>
            </where>
            GROUP BY b.id
            ORDER BY b.id DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAll(int offset, String searchType, String keyword);

    @Select("""
            SELECT b.id, b.title, b.user_id, u.nick_name nickName, uf.file_name profileImage, b.inserted, b.content
            FROM board b JOIN user u ON b.user_id = u.id
                         JOIN user_file uf ON b.user_id = uf.user_id
            WHERE b.id = #{id}
            """)
    Board selectById(Integer id);

    @Update("""
            UPDATE board
            SET id = #{id}, title = #{title}, content = #{content}, inserted = NOW()
            WHERE id = #{id}
            """)
    int update(Board board);

    @Delete("""
            DELETE FROM board
            WHERE id = #{boardId}
            """)
    int deleteById(Integer boardId);

    @Select("""
            SELECT file_name FROM board_file
            WHERE board_id = #{boardId}
            """)
    List<String> selectFileNameByBoardId(Integer boardId);

    @Delete("""
            DELETE FROM board_file
            WHERE board_id = #{boardId}
            AND file_name = #{fileName}
            """)
    void deleteFileByBoardIdAndName(Integer boardId, String fileName);

    @Delete("""
            DELETE FROM board_like
            WHERE board_id = #{boardId}
            AND user_id = #{userId}
            """)
    int deleteLikeByBoardIdAndUserId(Integer boardId, Integer userId);

    @Insert("""
            INSERT INTO board_like (board_id, user_id)
            VALUES (#{boardId}, #{userId})
            """)
    void insertLikeByIdAndUserId(Integer boardId, Integer userId);

    @Select("""
            SELECT COUNT(*)
            FROM board_like
            WHERE board_id = #{boardId}
            """)
    int selectCountLikeByBoardId(Integer boardId);

    @Select("""
            SELECT COUNT(*) FROM board_like
            WHERE board_id = #{boardId}
            AND user_id = #{userId}
            """)
    int selectLikeByBoardIdAndUserId(Integer boardId, String userId);

    @Select("""
            <script>
            SELECT COUNT(*) FROM board b
            <where>
                <if test="keyword != null and keyword != ''">
                    <bind name="pattern" value="'%' + keyword + '%'"/>
                    <choose>
                        <when test="searchType == 'all'">
                            (b.title LIKE #{pattern} OR b.content LIKE #{pattern})
                        </when>
                        <when test="searchType == 'title'">
                            b.title LIKE #{pattern}
                        </when>
                        <when test="searchType == 'content'">
                            b.content LIKE #{pattern}
                        </when>
                    </choose>
                </if>
            </where>
            </script>
            """)
    int selectTotalBoardCount(@Param("searchType") String searchType, @Param("keyword") String keyword);

    @Delete("""
            DELETE FROM board_like
            WHERE board_id = #{id}
            """)
    void deleteLikeByBoardId(Integer id);

    @Delete("""
            DELETE FROM board_file
            WHERE board_id = #{id}
            """)
    void deleteFileByBoardId(Integer id);

    @Select("""
            SELECT file_name
            FROM user_file
            WHERE user_id = #{userId}
            """)
    String selectFileNameByUserId(Integer userId);
}
