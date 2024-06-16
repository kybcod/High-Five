package com.backend.controller.review;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
