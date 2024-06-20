package com.backend.mapper.auction;

import com.backend.domain.auction.BidList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BidMapper {
    @Select("""
            SELECT *
            FROM bid_list
            WHERE product_id = #{productId} AND user_id = #{tokenUserId}
            """)
    BidList selectBidderByProductId(Integer productId, Integer tokenUserId);
}
