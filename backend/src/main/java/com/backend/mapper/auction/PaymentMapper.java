package com.backend.mapper.auction;

import com.backend.domain.auction.BidList;
import com.backend.domain.auction.Payment;
import org.apache.ibatis.annotations.Insert;
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
                   p.title          AS name,
                   bl.id AS bidListId
            FROM product p
                     JOIN bid_list bl ON bl.product_id = p.id
                     JOIN user u ON bl.user_id = u.id
            WHERE u.id = #{userId}
              AND p.id = #{productId}
            GROUP BY p.id
            """)
    Map<String, Object> selectPaymentInfo(Integer userId, Integer productId);

    @Insert("""
            INSERT INTO payment (merchant_uid, amount, bid_list_id)
            VALUES (#{merchantUid}, #{amount}, #{bidListId})
            """)
    int insert(Payment payment);

    @Select("""
            SELECT bl.product_id
            FROM payment pay
                     JOIN bid_list bl ON pay.bid_list_id = bl.id
            WHERE bid_list_id = #{bidListId};
            """)
    BidList selectBidListProductIdById(Integer bidListId);
}
