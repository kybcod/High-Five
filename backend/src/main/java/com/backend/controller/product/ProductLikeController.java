package com.backend.controller.product;


import com.backend.service.product.ProductLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products/like")
public class ProductLikeController {

    private final ProductLikeService service;

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    @Description("상품좋아요 저장")
    public Map<String, Object> likeProduct(@RequestBody Map<String, Object> likeInfo, Authentication authentication) {
        return service.like(likeInfo, authentication);
    }

    @GetMapping("{userId}")
    @Description("상품좋아요 조회")
    public List<Integer> getLike(@PathVariable Integer userId) {
        return service.getLike(userId);
    }
}
