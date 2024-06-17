package com.backend.service.review;

import com.backend.domain.review.Review;
import com.backend.mapper.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewMapper mapper;

    public List<Map<String, Object>> selectReviewList() {
        return mapper.selectReviewList();
    }

    public void insertReview(Review review) {
        
        // 문자열 저장?
        // 쪼개서 저장
//        List<Integer> reviewList = review.getReviewId();
//        Integer productId = review.getProductId();
//        Integer userId = review.getUserId();
//        int success;
//        for (Integer reviewId : reviewList) {
//            success = mapper.insertReview(productId, userId, reviewId);
//        }
    }
}
