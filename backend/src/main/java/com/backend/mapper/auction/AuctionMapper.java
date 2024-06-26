package com.backend.mapper.auction;

import com.backend.domain.auction.BidList;
import com.backend.domain.product.Product;
import com.backend.domain.product.ProductFile;
import org.apache.ibatis.annotations.*;
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
            SET bid_price = #{bidPrice}, updated = NOW()
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
            SELECT *
            FROM bid_list b
                     JOIN product p ON b.product_id = p.id
                    LEFT JOIN product_like pl ON pl.product_id = p.id
            WHERE b.user_id = #{userId}
            GROUP BY p.id
            ORDER BY
                CASE WHEN #{bidSort} = 0 THEN b.updated END DESC,
                CASE WHEN #{bidSort} = 1 THEN COUNT(pl.id) END DESC,
                CASE WHEN #{bidSort} = 2 THEN p.start_price END ASC,
                CASE WHEN #{bidSort} = 3 THEN p.start_price END DESC,
                p.id DESC
            LIMIT #{pageable.pageSize} OFFSET #{pageable.offset}
            """)
    @Results(id = "productBidList", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "product", column = "product_id", one = @One(select = "selectProductByProductId")),
    })
    List<BidList> selectBidListByUserIdWithPagination(Integer userId, Pageable pageable, int bidSort);

    @Select("""
            SELECT * FROM product
            WHERE id = #{productId}
            """)
    @Results(id = "product", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "productFileList", column = "id", many = @Many(select = "selectFileByProductId")),
    })
    List<Product> selectProductByProductId(Integer productId);

    @Select("""
            SELECT product_id, file_name FROM product_file
            WHERE product_id = #{productId}
            """)
    List<ProductFile> selectFileByProductId(Integer productId);

    @Select("""
            SELECT COUNT(*)
            FROM bid_list
            WHERE user_id = #{userId}
            """)
    int selectTotalCountBidsByUserId(Integer userId);

    @Select("""
            SELECT id, user_id, product_id, bid_price, bid_status
            FROM bid_list
            WHERE product_id = #{productId}
            ORDER BY bid_price DESC, updated
            LIMIT 1
            """)
    BidList selectMaxPriceByProductId(Integer productId);

    @Update("""
            UPDATE bid_list
            SET bid_status = #{bidStatus}
            WHERE id = #{id}
            """)
    int updateBidStatusByProductId(Integer id, boolean bidStatus);

    @Delete("DELETE FROM bid_list WHERE product_id=#{productId}")
    int deleteBidListByProductId(Integer productId);


    // -- chatService
    @Select("""
            SELECT *
            FROM bid_list
            WHERE product_id = #{productId} AND user_id = #{userId}
            """)
    BidList selectBidderByProductId(Integer productId, Integer userId);

    @Select("""
            SELECT user_id
            FROM bid_list
            WHERE product_id = #{productId} AND bid_status = true
            """)
    Integer selectBuyerIdByProductId(Integer productId);
}
