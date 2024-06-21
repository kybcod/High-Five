package com.backend.mapper.product;

import com.backend.domain.chat.ChatRoom;
import com.backend.domain.product.Product;
import com.backend.domain.product.ProductFile;
import com.backend.domain.product.ProductWithUserDTO;
import org.apache.ibatis.annotations.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Mapper
public interface ProductMapper {

    @Insert("""
            INSERT INTO product (title, category, start_price, end_time, content, user_id)
            VALUES (#{title}, #{category}, #{startPrice}, #{endTime}, #{content}, #{userId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Product product);

    @Insert("""
            INSERT INTO product_file (product_id, file_name)
            VALUES (#{productId}, #{fileName})
            """)
    int insertFile(Integer productId, String fileName);

    @Select("""
            SELECT p.id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.start_time,
                   p.end_time,
                   p.content,
                   p.status
            FROM product p
            ORDER BY p.status DESC, p.end_time
            """)
    @Results(id = "productList", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "productFileList", column = "id", many = @Many(select = "selectFileByProductId"))
    })
    List<Product> selectAll();

    @Select("""
            SELECT product_id, file_name FROM product_file
            WHERE product_id = #{productId}
            """)
    List<ProductFile> selectFileByProductId(Integer productId);

    @Select("""
            SELECT p.id,
                   p.user_id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.start_time,
                   p.end_time,
                   p.content,
                   p.view_count,
                   p.status,
                   COUNT(DISTINCT bl.user_id) AS numberOfJoin,
                   u.nick_name       AS userNickName,
                   MAX(bl.bid_price) AS maxBidPrice
            FROM product p
                     LEFT JOIN bid_list bl
                               ON p.id = bl.product_id
                     JOIN user u ON u.id = p.user_id
            WHERE p.id = #{id};
            """)
    @Results(id = "productDetail", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "productFileList", column = "id", many = @Many(select = "selectFileByProductId"))
    })
    Product selectById(Integer id);

    @Select("""
            <script>
            <bind name="pattern" value="'%' + keyword + '%'" />
            SELECT p.id,
                    p.title,
                    p.category,
                    p.start_price,
                    p.start_time,
                    p.end_time,
                    p.content,
                    p.status
            FROM product p
            WHERE p.title LIKE #{pattern}
            <if test="category != null and category != ''">
                AND p.category = #{category}
            </if>
            ORDER BY p.status DESC, p.end_time
            LIMIT #{pageable.pageSize} OFFSET #{pageable.offset}
            </script>
            """)
    @Results(id = "productSearchList", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "productFileList", column = "id", many = @Many(select = "selectFileByProductId"))
    })
    List<Product> selectWithPageable(Pageable pageable, String keyword, String category);

    @Select("""
            <script>
            <bind name="pattern" value="'%' + keyword + '%'" />
            SELECT COUNT(*) FROM product p
            WHERE p.title LIKE #{pattern}
            <if test="category != null and category != ''">
                AND p.category = #{category}
            </if>
            </script>
            """)
    int selectTotalCount(String keyword, String category);

    @Delete("DELETE FROM product_file WHERE product_id=#{productId} AND file_name=#{fileName}")
    int deleteFileByProductIdAndFileName(Integer productId, String fileName);

    @Update("""
            UPDATE product 
            SET title=#{title}, category=#{category}, end_time=#{endTime}, content=#{content}, start_price=#{startPrice}
            WHERE id=#{id}
            """)
    int update(Product product);

    @Delete("DELETE FROM product WHERE id=#{id}")
    int deleteByProductId(Integer id);

    @Delete("DELETE FROM product_file WHERE product_id=#{productId}")
    int deleteFileByProductId(Integer productId);


    @Update("""
            UPDATE product SET 
            view_count = view_count + 1
            WHERE id=#{id}
            """)
    int updateViewCount(Integer id);


    @Select("SELECT COUNT(*) FROM product_like WHERE product_id=#{productId} AND user_id=#{userId}")
    int selectLikeByProductIdAndUserId(Integer productId, String userId);

    @Select("SELECT COUNT(*) FROM product_like WHERE product_id=#{productId}")
    int selectCountLikeByProductId(Integer id);


    @Delete("DELETE FROM product_like WHERE product_id=#{productId}")
    int deleteLikeByProductId(Integer productId);


    @Select("""
            SELECT p.id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.status,
                   p.content,
                   p.start_time,
                   p.end_time,
                   bl.bid_status
            FROM product p
                     LEFT JOIN bid_list bl
                               ON p.id = bl.product_id
            ORDER BY p.end_time;
            """)
    List<Product> selectProductAndBidList();

    @Update("""
            UPDATE product
            SET status=#{status}
            WHERE id=#{id}
            """)
    int updateStatus(Product product);


    // -- ChatService
    @Select("""
            SELECT user_id
            FROM product
            WHERE id = #{productId}
            """)
    Integer selectProductSellerId(Integer productId);

    @Select("""
            SELECT id, title, status, review_status
            FROM product
            WHERE id =#{productId}
            """)
    Product selectChatProductInfo(Integer productId);

    @Select("""
            SELECT b.user_id buyerId
            FROM product p
                     LEFT JOIN bid_list b ON p.id = b.product_id
            WHERE b.product_id = #{productId};
            """)
    Integer selectBuyerId(Integer productId);

    @Select("""
            SELECT p.id,
                   p.user_id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.start_time,
                   p.end_time,
                   p.content,
                   p.view_count,
                   p.status
            FROM product p
                     JOIN user u
                          ON p.user_id = u.id
            WHERE p.user_id = #{userId}
            ORDER BY p.end_time
            LIMIT #{pageable.pageSize} OFFSET #{pageable.offset}
            """)
    @Results(id = "productListByUserId", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "productFileList", column = "id", many = @Many(select = "selectFileByProductId"))
    })
    List<Product> selectProductsByUserIdWithPagination(Integer userId, Pageable pageable);

    @Select("""
            SELECT COUNT(*)
            FROM product
            WHERE user_id = #{userId}
            """)
    int selectTotalCountByUserId(Integer userId);

    @Select("""
            SELECT p.id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.start_time,
                   p.end_time,
                   p.content,
                   p.status,
                   p.user_id
            FROM product p
                     JOIN product_like pl ON p.id = pl.product_id
            WHERE pl.user_id = #{userId}
            LIMIT #{pageable.pageSize} OFFSET #{pageable.offset}
            """)
    @Results(id = "productAndProductLikeList", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "productFileList", column = "id", many = @Many(select = "selectFileByProductId"))
    })
    List<Product> selectLikeSelectByUserId(Integer userId, Pageable pageable);

    @Select("""
            SELECT COUNT(*)
            FROM product_like
            WHERE user_id = #{userId};
            """)
    int selectCountLikeByUserId(Integer userId);

    @Select("""
            SELECT p.id,
                   p.user_id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.start_time,
                   p.end_time,
                   p.content,
                   p.view_count,
                   p.status,
                   COUNT(DISTINCT bl.user_id) AS numberOfJoin,
                   u.nick_name       AS userNickName,
                   MAX(bl.bid_price) AS maxBidPrice
            FROM product p
                     LEFT JOIN bid_list bl
                               ON p.id = bl.product_id
                     JOIN user u ON u.id = p.user_id
            WHERE p.id = #{id};
            """)
    ProductWithUserDTO selectById2(Integer id);

    @Select("""
            SELECT nick_name
            FROM user
            WHERE id=#{userId}
            """)
    String selectUserNickName(Integer userId);

    @Delete("DELETE FROM bid_list WHERE product_id=#{productId}")
    int deleteBidListByProductId(Integer productId);

    @Delete("DELETE FROM chat_room WHERE product_id=#{productId}")
    int deleteChatRoomByProductId(Integer productId);

    @Delete("DELETE FROM chat_room WHERE seller_id=#{userId}")
    int deleteChatRoomBySellerId(Integer userId);

    @Select("SELECT id FROM chat_room WHERE product_id=#{productId}")
    List<Integer> selectChatByChatRoomId(Integer productId);

    @Delete("DELETE FROM chat WHERE chat_room_id = #{chatRoomId}")
    int deleteChatByChatRoomId(Integer chatRoomId);


    // -- review 생성 시 review_status 변경
    @Update("""
            UPDATE product
            SET review_status = 1
            WHERE id = #{productId};
            """)
    int updateReviewStatusById(Integer productId);


    @Select("""
            SELECT id, title
            FROM product
            WHERE id = #{productId}
            """)
    Product selectProductTitleById(ChatRoom chatRoom);

    @Update("""
            UPDATE product
            SET payment_status = #{paymentStatus}
            WHERE id = #{productId}
            """)
    int updatePaymentStatus(Integer productId, boolean paymentStatus);

}