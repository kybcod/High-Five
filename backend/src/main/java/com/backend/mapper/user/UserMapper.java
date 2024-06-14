package com.backend.mapper.user;

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

    @Delete("""
                DELETE FROM authority
                WHERE user_id = #{userId}
            """)
    int deleteAuthorityById(Integer userId);

    @Select("""
                SELECT id, email, nick_name, inserted
                FROM user
            """)
    List<User> selectUserList();
}
