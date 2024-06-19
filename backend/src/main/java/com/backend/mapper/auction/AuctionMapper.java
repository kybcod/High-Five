package com.backend.mapper.auction;

import com.backend.domain.auction.BidList;
import com.backend.domain.product.Product;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.data.domain.Pageable;

import java.util.List;

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

    @Select("""
            SELECT
                p.id,
                p.title,
                p.category,
                p.start_price,
                p.status,
                p.content,
                p.start_time,
                p.end_time,
                p.view_count,
                p.review_status,
                b.user_id,
                b.bid_price,
                b.bid_status
            FROM product p
            JOIN bid_list b ON p.id = b.product_id
            WHERE b.user_id = #{userId}
            ORDER BY p.end_time DESC
            LIMIT #{pageable.pageSize} OFFSET #{pageable.offset}
            """)
    List<Product> selectBidListByUserIdWithPagination(Integer userId, Pageable pageable);

    @Select("""
            SELECT COUNT(*)
            FROM bid_list
            WHERE user_id = #{userId}
            """)
    int selectTotalCountBidsByUserId(Integer userId);

    @Select("""
            SELECT *
            FROM bid_list
            WHERE user_id=#{userId} AND product_id=#{productId}
            """)
    List<BidList> selectBidsByUserIdAndProductId(Integer userId, Integer productId);

    @Select("""
            SELECT id, user_id, product_id, bid_price, bid_status
            FROM bid_list
            WHERE product_id = #{productId}
            ORDER BY bid_price DESC
            LIMIT 1
            """)
    BidList selectMaxPriceByProductId(Integer productId);

    @Update("""
            UPDATE bid_list
            SET bid_status = #{bidStatus}
            WHERE id = #{id}
            """)
    int updateBidStatusByProductId(Integer id, boolean bidStatus);
}
