package com.backend.mapper.user;

import com.backend.domain.chat.ChatRoom;
import com.backend.domain.user.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Insert("""
                INSERT INTO user
                (email, password, nick_name, phone_number)
                VALUES (#{email}, #{password}, #{nickName}, #{phoneNumber})
            """)
    int insertUser(User user);

    @Select("""
                SELECT *
                FROM user
                WHERE email = #{email}
            """)
    User selectUserByEmail(String email);

    @Select("""
                SELECT *
                FROM user
                WHERE nick_name = #{nickName}
            """)
    User selectUserByNickName(String nickName);

    @Select("""
                SELECT name
                FROM authority
                WHERE user_id = #{userId}
            """)
    List<String> selectAuthoritiesByUserId(Integer userId);

    @Select("""
                SELECT email
                FROM user
                WHERE id = #{userId}
            """)
    String selectEmailById(Integer userId);

    // -- ChatService
    @Select("""
            SELECT nick_name
            FROM user
            WHERE id = #{sellerId}
            """)
    String selectSellerName(ChatRoom chatRoom);

    @Select("""
                SELECT *
                FROM user
                WHERE id = #{userId}
            """)
    User selectUserById(Integer id);

    @Delete(
            """
                        DELETE FROM user
                        WHERE id = #{id}
                    """
    )
    int deleteUserById(Integer id);

    @Update("""
                UPDATE user
                SET password = #{password},
                    nick_name = #{nickName}
                WHERE id = #{id}
            """)
    int updateUser(User user);

    @Select("""
                <script>
                SELECT id, email, nick_name, inserted
                FROM user
                ORDER BY id DESC
                LIMIT #{offset}, 10
                </script>
            """)
    List<User> selectUserList(int offset);

//    @Select("""
//                <script>
//                SELECT id, email, nick_name, inserted
//                FROM user
//                    <trim prefix="WHERE" prefixOverrides="OR">
//                        <bind name="pattern" value="%" + keyword + "%"/>
//                        <if test="searchType != null">
//                            <if test="keyword != ''">
//                                OR email LIKE #{pattern}
//                                OR nick_name LIKE #{pattern}
//                            </if>
//                            <if test searchType == 'black'>
//                                OR black_count > 5
//                            </if>
//                        </if>
//                    <trim>
//                ORDER BY id DESC
//                LIMIT #{offset}, 10
//                </script>
//            """)
//    List<User> selectUserList(int offset);

    @Delete("""
                DELETE FROM authority
                WHERE user_id = #{userId}
            """)
    int deleteAuthorityById(Integer userId);

    @Select("""
                SELECT COUNT(*) FROM user
            """)
    int selectTotalUserCount();

    @Insert("""
                INSERT INTO code
                (phone_number, code)
                VALUES (#{phoneNumber}, #{code})
            """)
    void insertCode(String phoneNumber, String code);

    @Select("""
                SELECT code AS verificationCode
                FROM code
                WHERE phone_number = #{phoneNumber}
            """)
    Integer selectCodeByPhoneNumber(String phoneNumber);

    @Delete("""
                DELETE FROM code
                WHERE phone_number = #{phone_number}
            """)
    int deleteCodeByPhoneNumber(String phoneNumber);

    @Update("""
                UPDATE user
                SET black_count = black_count + 1
                WHERE id = #{id}
            """)
    int updateBlackCountByUserId(Integer id);
}
