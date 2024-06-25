package com.backend.mapper.review;

import com.backend.domain.review.Review;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.context.annotation.Description;

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
            VALUES (#{productId}, #{userId}, #{reviewIds})
            """)
    int insertReview(Review review);

    @Select("""
            SELECT review_id reviewIds
            FROM review
            WHERE product_id = #{productId}
            """)
    String selectReviewById(Integer productId);

    @Select("""
            SELECT * FROM review_list WHERE id = #{id}
            """)
    Map<String, Object> selectReviewListById(Integer id);


    @Description("상품 삭제 시 리뷰 삭제")
    @Delete("DELETE FROM review WHERE product_id=#{productId} ")
    Integer deleteReviewByProductId(Integer productId);
}
