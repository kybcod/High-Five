package com.backend.domain.review;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class Review {
    private Integer productId;
    private Integer userId;
    private List<Integer> reviewId;
    private String reviewIds;
    private List<Map<String, Object>> reviewList;
    private LocalDateTime inserted;
}
