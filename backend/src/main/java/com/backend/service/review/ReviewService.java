package com.backend.service.review;

import com.backend.domain.review.Review;
import com.backend.mapper.product.ProductMapper;
import com.backend.mapper.review.ReviewMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;
    private final ProductMapper productMapper;

    public List<Map<String, Object>> selectReviewList() {
        return mapper.selectReviewList();
    }

    public void insertReview(Review review) throws JsonProcessingException {
        String reviewIds = objectMapper.writeValueAsString(review.getReviewId());
        review.setReviewIds(reviewIds);
        int createSuccess = mapper.insertReview(review);
        if (createSuccess == 1) {
            Integer productId = review.getProductId();
            int productSuccess = productMapper.updateReviewStatusById(productId);
        } else {
        }
    }

    public boolean validate(Review review) {
        if (review.getUserId() == null) {
            return false;
        }
        if (review.getReviewId() == null) {
            return false;
        }
        if (review.getProductId() == null) {
            return false;
        }
        return true;
    }
}
