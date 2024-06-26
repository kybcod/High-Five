package com.backend.controller.review;

import com.backend.domain.review.Review;
import com.backend.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService service;

    @GetMapping("/list")
    public ResponseEntity getReviewList() {
        List<Map<String, Object>> result = service.selectReviewList();
        if (result == null || result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok().body(result);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity createReview(@RequestBody Review review, Authentication authentication) throws Exception {
        if (review.getUserId() == Integer.valueOf(authentication.getName())) {
            if (service.validate(review)) {
                boolean success = service.insertReview(review);
                if (success) {
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("{productId}")
    public ResponseEntity getReviewById(@PathVariable Integer productId) throws Exception {
        List<Map<String, Object>> reviewList = service.selectReviewById(productId);
        if (reviewList == null || reviewList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.ok().body(reviewList);
        }
    }
}
