package com.backend.mapper.user;

import com.backend.domain.chat.ChatRoom;
import com.backend.domain.user.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

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
            SELECT id, nick_name
            FROM user
            WHERE id = #{userId} OR id = #{sellerId}
            """)
    List<Map<String, Object>> selectChatName(ChatRoom chatRoom);
}
