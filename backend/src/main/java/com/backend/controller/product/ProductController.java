package com.backend.controller.product;


import com.backend.domain.product.Product;
import com.backend.service.product.ProductService;
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity upload(Product product, Authentication authentication,
                                 @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(product)) {
            service.upload(product, files, authentication);
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
    public List<Integer> getLike(@PathVariable Integer userId) {
        return service.getLike(userId);
    }


    //    // TODO :  나중에 실행할 때 주석 풀기
//    @Scheduled(cron = "0 0 0/1 * * *", zone = "Asia/Seoul") //1시간
//    public void checkEndTimeAndProductState() {
//        service.updateProductState();
//    }

    // User와 Product 관련 Controller
    @GetMapping("user/{userId}")
    public Map<String, Object> getUserProducts(@PathVariable Integer userId,
                                               @RequestParam(defaultValue = "1") int page) {
        return service.getProductsByUserId(userId, PageRequest.of(page - 1, 9));
    }

    // MyPage
    @GetMapping("user/{userId}/like")
    public Map<String, Object> getUserProductsLike(@PathVariable Integer userId, @RequestParam(defaultValue = "1") int page) {
        return service.getProductsLikeByUserId(userId, PageRequest.of(page - 1, 9));
    }


// TODO: 코드 정리

//    @GetMapping("/test/{id}")
//    public ProductListResponse getProductById(@PathVariable Integer id, Authentication authentication) {
//        return service.getById(id, authentication);
//    }
}
