package com.backend.service.review;

import com.backend.domain.review.Review;
import com.backend.mapper.product.ProductMapper;
import com.backend.mapper.review.ReviewMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    public boolean insertReview(Review review) throws JsonProcessingException {
        review.setReviewIds(objectMapper.writeValueAsString(review.getReviewId()));
        int createSuccess = mapper.insertReview(review);
        if (createSuccess == 1) {
            int productSuccess = productMapper.updateReviewStatusById(review.getProductId());
            if (productSuccess == 1) {
                return true;
            }
        }
        return false;
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

    public List<Map<String, Object>> selectReviewById(Integer productId) throws JsonProcessingException {
        String reviewIds = mapper.selectReviewById(productId);
        if (reviewIds != null) {
            // Jackson 라이브러리를 사용하여 JSON 문자열을 자바 객체로 변환
            List<Integer> reviewIdList = (objectMapper.readValue(reviewIds, List.class));
            List<Map<String, Object>> reviewList = new ArrayList<>();
            for (Integer id : reviewIdList) {
                reviewList.add(mapper.selectReviewListById(id));
            }
            return reviewList;
        }
        return null;
    }
}
