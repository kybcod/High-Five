package com.backend.controller.product;


import com.backend.domain.product.Product;
import com.backend.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Description("상품 업로드")
    public ResponseEntity upload(Product product, Authentication authentication,
                                 @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(product)) {
            service.upload(product, files, authentication);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping
    @Description("상품조회 - 메인 페이지")
    public Map<String, Object> list() {
        return service.list();
    }

    @GetMapping("search")
    @Description("상품조회 - 페이징, 키워드, 카테고리 검색")
    public Map<String, Object> getListProduct(@RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "") String title,
                                              @RequestParam(defaultValue = "") String category
    ) {
        return service.getList(PageRequest.of(page - 1, 20), title, category);
    }

    @GetMapping("{id}")
    @Description("상품상세")
    public ResponseEntity getProduct(@PathVariable Integer id, Authentication authentication) {
        Map<String, Object> result = service.get(id, authentication);
        if (result.get("product") == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(result);
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    @Description("상품수정")
    public ResponseEntity updateProduct(Product product, Authentication authentication,
                                        @RequestParam(value = "removedFileList[]", required = false) List<String> removedFileList,
                                        @RequestParam(value = "newFileList[]", required = false) MultipartFile[] newFileList
    ) throws IOException {

        if (!service.hasAccess(product.getId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (service.validate(product)) {
            service.edit(product, removedFileList, newFileList);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    @Description("상품삭제")
    public ResponseEntity deleteProduct(@PathVariable Integer id, Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            service.remove(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // MyPage
    @GetMapping("user/{userId}")
    @Description("MyPage 판매 목록 : 상품조회 - 사용자별")
    public Map<String, Object> getUserProducts(@PathVariable Integer userId,
                                               @RequestParam(defaultValue = "1") int shopPage,
                                               @RequestParam(defaultValue = "0") int sort) {
        return service.getProductsByUserId(userId, PageRequest.of(shopPage - 1, 9), sort);
    }

    @GetMapping("user/{userId}/like")
    @Description("MyPage 찜 목록 : 상품조회 + 좋아요 - 사용자별")
    public Map<String, Object> getUserProductsLike(@PathVariable Integer userId, @RequestParam(defaultValue = "1") int likePage) {
        return service.getProductsLikeByUserId(userId, PageRequest.of(likePage - 1, 9));
    }

}
