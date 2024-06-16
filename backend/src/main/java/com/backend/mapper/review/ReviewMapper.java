package com.backend.mapper.review;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReviewMapper {
    @Select("""
            SELECT *
            FROM review_list
            """)
    List<Map<String, Object>> selectReviewList();

    @Insert("""
            INSERT INTO review (product_id, user_id, review_id)
            VALUES (#{productId}, #{userId}, #{reviewId})
            """)
    int insertReview(Integer productId, Integer userId, Integer reviewId);
}
