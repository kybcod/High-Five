package com.backend.mapper.User;

import com.backend.domain.User.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
                SELECT u.id, u.email, u.password, u.nick_name, u.phone_number, u.black_count, u.inserted, a.name authority
                FROM user u JOIN authority a ON u.id = a.user_id
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
}
