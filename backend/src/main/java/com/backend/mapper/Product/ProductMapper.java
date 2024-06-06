package com.backend.mapper.Product;

import com.backend.domain.Product.Product;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

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
                   p.content,
                   pf.file_name
            FROM product p
                     LEFT JOIN (SELECT product_id, file_name
                                FROM product_file
                                GROUP BY product_id) pf ON p.id = pf.product_id
            ORDER BY p.end_time;
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
}
