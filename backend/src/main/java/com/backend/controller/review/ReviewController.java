package com.backend.controller.review;

import com.backend.domain.review.Review;
import com.backend.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService service;

    @GetMapping("/list")
    public ResponseEntity reviewList() {
        List<Map<String, Object>> result = service.selectReviewList();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("{productId}")
    public void reviewAdd(@PathVariable Integer productId, @RequestBody Review review) {
        service.insertReview(review);
    }
}
