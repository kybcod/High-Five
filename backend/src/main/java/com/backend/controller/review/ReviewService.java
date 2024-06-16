package com.backend.controller.review;

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
}
