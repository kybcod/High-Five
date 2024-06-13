package com.backend.controller.Product;


import com.backend.domain.Product.Product;
import com.backend.domain.Product.auctionDomain;
import com.backend.service.Product.ProductService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity upload(Product product,
                                 @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(product)) {
            service.upload(product, files);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping
    public List<Product> list() {
        return service.list();
    }

    @GetMapping("list")
    public Map<String, Object> getListProduct(@RequestParam(defaultValue = "1") int page,
                                              @RequestParam(defaultValue = "") String keyword,
                                              @RequestParam(defaultValue = "") String category
    ) {
        return service.getList(PageRequest.of(page - 1, 20), keyword, category);
    }

    @GetMapping("{id}")
    public ResponseEntity getProduct(@PathVariable Integer id, Authentication authentication) {
        Map<String, Object> result = service.get(id, authentication);
        if (result.get("product") == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(result);
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
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
    public ResponseEntity deleteProduct(@PathVariable Integer id, Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            service.remove(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }


    // 좋아요 Controller
    @PutMapping("like")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> likeProduct(@RequestBody Map<String, Object> likeInfo, Authentication authentication) {
        return service.like(likeInfo, authentication);
    }

    @GetMapping("like/{userId}")
    public List<Integer> getLike(@PathVariable Integer userId, Authentication authentication) {
        return service.getLike(userId, authentication);
    }

    // 참여하기 Controller
    @PostMapping("join")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity joinProduct(@RequestBody auctionDomain auction, Authentication authentication) {
        if (service.hasAccess(auction.getProductId(), authentication)) {
            service.insertBidPrice(auction);
            return ResponseEntity.ok().build();

        }
        return ResponseEntity.badRequest().build();
    }
}
