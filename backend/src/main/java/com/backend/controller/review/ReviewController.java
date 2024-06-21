package com.backend.controller.review;

import com.backend.domain.review.Review;
import com.backend.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
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
            return ResponseEntity.badRequest().build();
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
                    return ResponseEntity.badRequest().build();
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid review data.");
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("{productId}")
    public ResponseEntity getReviewById(@PathVariable Integer productId) throws Exception {
        Review review = service.selectReviewById(productId);
        return ResponseEntity.ok().body(review);
    }
}
