package com.backend.mapper.auction;

import com.backend.domain.auction.BidList;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface AuctionMapper {

    @Select("""
            SELECT COUNT(*)
            FROM bid_list
            WHERE product_id = #{productId}
            AND user_id = #{userId}
            """)
    boolean existsBid(Integer productId, Integer userId);

    @Update("""
            UPDATE bid_list
            SET bid_price = #{bidPrice}
            WHERE product_id = #{productId}
            AND user_id = #{userId}
            """)
    int updateBidPrice(BidList bid);

    @Insert("""
            INSERT INTO bid_list (product_id, user_id, bid_price)
            VALUES (#{productId}, #{userId}, #{bidPrice})
            """)
    void insertBidPrice(BidList bid);
}
