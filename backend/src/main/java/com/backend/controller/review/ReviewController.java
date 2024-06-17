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
    public ResponseEntity loadReviewList() {
        List<Map<String, Object>> result = service.selectReviewList();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity createReview(@RequestBody Review review, Authentication authentication) throws Exception {
        if (review.getUserId() == Integer.valueOf(authentication.getName())) {
            if (service.validate(review)) {
                service.insertReview(review);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("{productId}")
    public void findReviewById(@PathVariable Integer productId) throws Exception {

    }
}
