package com.backend.mapper.product;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductLikeMapper {
    @Delete("DELETE FROM product_like WHERE product_id=#{productId} AND user_id=#{userId}")
    int deleteLikeByProductIdAndUserId(Integer productId, Integer userId);

    @Insert("""
            INSERT INTO product_like (product_id, user_id)
            VALUES (#{productId}, #{userId})
            """)
    int insertLikeByProductIdAndUserId(Integer productId, Integer userId);

    @Select("SELECT product_id FROM product_like WHERE user_id=#{userId}")
    List<Integer> selectLikeByUserId(Integer userId);

    @Select("SELECT COUNT(*) FROM product_like WHERE product_id=#{productId}")
    int selectCountLikeByProductId(Integer id);

    @Delete("DELETE FROM product_like WHERE product_id=#{productId}")
    int deleteLikeByProductId(Integer productId);
}