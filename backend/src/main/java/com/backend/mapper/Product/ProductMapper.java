package com.backend.mapper.Product;

import com.backend.domain.Product.BidList;
import com.backend.domain.Product.Product;
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
            ORDER BY CASE WHEN p.status = true THEN 0 ELSE 1 END, p.end_time
            """)
    List<Product> selectAll();

    @Select("""
            SELECT file_name FROM product_file
            WHERE product_id = #{productId}
            """)
    List<String> selectFileByProductId(Integer productId);

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
                   u.nick_name       AS userNickName
            FROM product p
                     LEFT JOIN bid_list bl
                               ON p.id = bl.product_id
                     JOIN user u ON u.id = p.user_id
            WHERE p.id = #{id};
            """)
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
            ORDER BY CASE WHEN p.status = true THEN 0 ELSE 1 END, p.end_time
            LIMIT #{pageable.pageSize} OFFSET #{pageable.offset}
            </script>
            """)
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

    @Delete("DELETE FROM product_like WHERE product_id=#{productId} AND user_id=#{userId}")
    int deleteLikeByBoardIdAndUserId(Integer productId, Integer userId);

    @Insert("""
            INSERT INTO product_like (product_id, user_id)
            VALUES (#{productId}, #{userId})
            """)
    int insertLikeByBoardIdAndUserId(Integer productId, Integer userId);

    @Select("SELECT product_id FROM product_like WHERE user_id=#{userId}")
    List<Integer> selectLikeByUserId(Integer userId);

    @Select("SELECT COUNT(*) FROM product_like WHERE product_id=#{productId} AND user_id=#{userId}")
    int selectLikeByProductIdAndUserId(Integer productId, String userId);

    @Select("SELECT COUNT(*) FROM product_like WHERE product_id=#{productId}")
    int selectCountLikeByProductId(Integer id);

    @Insert("""
            INSERT INTO bid_list (product_id, user_id, bid_price)
            VALUES (#{productId}, #{userId}, #{bidPrice})
            """)
    void insertBidPrice(BidList bid);

    @Delete("DELETE FROM product_like WHERE product_id=#{productId}")
    int deleteLikeByBoardId(Integer productId);

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

    @Select("""
            SELECT p.id,
                   p.title,
                   p.category,
                   p.start_price,
                   p.status,
                   p.content,
                   p.start_time,
                   p.end_time,
                   bl.status
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

    @Update("""
            UPDATE bid_list
            SET status = #{status}
            WHERE product_id = #{productId}
            """)
    int updateBidStatusByProductId(Integer productId, boolean status);

    @Select("""
            SELECT * 
            FROM product p
            WHERE p.user_id = #{userId}
            ORDER BY CASE WHEN p.status = true THEN 0 ELSE 1 END, p.end_time
            """)
    List<Product> selectProductsByUserId(Integer userId);
}