package com.backend.mapper.chat;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ChatMapper {
    @Select("""
            SELECT user_Id
            FROM product
            WHERE id = #{productId};
            """)
    Integer selectSellerIdByProductId(String productId);
}
