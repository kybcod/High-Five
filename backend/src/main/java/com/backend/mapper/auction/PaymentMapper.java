package com.backend.mapper.auction;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

@Mapper
public interface PaymentMapper {

    @Select("""
            SELECT p.id             AS productId,
                   u.id        AS userId,
                   u.nick_name      AS buyerName,
                   u.phone_number   AS buyerTel,
                   u.email          AS buyerEmail,
                   MAX(bl.bid_price) AS amount,
                   p.title          AS name
            FROM product p
                     JOIN bid_list bl ON bl.product_id = p.id
                     JOIN user u ON bl.user_id = u.id
            WHERE u.id = #{userId}
              AND p.id = #{productId}
            GROUP BY p.id
            """)
    Map<String, Object> selectPaymentInfo(Integer userId, Integer productId);
}
