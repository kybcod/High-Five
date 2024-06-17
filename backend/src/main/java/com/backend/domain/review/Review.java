package com.backend.domain.review;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Review {
    private Integer productId;
    private Integer userId;
    private List<Integer> reviewId;
    private LocalDateTime inserted;
}
