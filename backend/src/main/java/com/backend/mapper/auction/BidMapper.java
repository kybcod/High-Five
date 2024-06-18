package com.backend.mapper.auction;

import com.backend.domain.auction.BidList;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BidMapper {
    @Select("""
            SELECT product_id, user_id, bid_price, bid_status status
            FROM bid_list
            WHERE product_id =#{productId} AND bid_status = true
            """)
    BidList selectBidderByProductId(Integer productId);
}
