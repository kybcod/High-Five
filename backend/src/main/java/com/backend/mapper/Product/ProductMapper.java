package com.backend.mapper.Product;

import com.backend.domain.Product.Product;
import org.apache.ibatis.annotations.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Mapper
public interface ProductMapper {

    @Insert("""
            INSERT INTO product (title, category, start_price, end_time, content)
            VALUES (#{title}, #{category}, #{startPrice}, #{endTime}, #{content})
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
                   p.content
            FROM product p
            ORDER BY p.end_time
            """)
    List<Product> selectAll();

    @Select("""
            SELECT file_name FROM product_file
            WHERE product_id = #{productId}
            """)
    List<String> selectFileByProductId(Integer productId);

    @Select("""
            SELECT * FROM product
            WHERE id = #{id}
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
                    p.content
            FROM product p
            WHERE p.title LIKE #{pattern}
            <if test="category != null and category != ''">
                AND p.category = #{category}
            </if>
            ORDER BY p.end_time
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

    @Delete("DELETE FROM product_like WHERE product_id=#{productId} AND user_id=#{userId}")
    int deleteLikeByProductIdAndMemberId(Integer productId, Integer userId);

    @Insert("INSERT INTO product_like (product_id, user_id) VALUES (#{productId}, #{userId})")
    int insertLikeByProductIdAndMemberId(Integer productId, Integer userId);

    @Update("""
            UPDATE product SET 
            view_count = view_count + 1
            WHERE id=#{id}
            """)
    int updateViewCount(Integer id);
}