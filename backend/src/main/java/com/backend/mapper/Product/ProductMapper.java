package com.backend.mapper.Product;

import com.backend.domain.Product.Product;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface ProductMapper {

    @Insert("""
            INSERT INTO product (id, category, start_price, end_time, content)
            VALUES (#{id}, #{category}, #{startPrice}, #{endTime}, #{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Product product);
}
