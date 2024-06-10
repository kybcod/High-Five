package com.backend.controller.Product;


import com.backend.domain.Product.Product;
import com.backend.service.Product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
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
    public Product getProduct(@PathVariable Integer id) {
        return service.get(id);
    }

    @PutMapping
    public ResponseEntity updateProduct(Product product,
                                        @RequestParam(value = "removedFileList[]", required = false) List<String> removedFileList,
                                        @RequestParam(value = "newFileList[]", required = false) MultipartFile[] newFileList
    ) throws IOException {
        if (service.validate(product)) {
            service.edit(product, removedFileList, newFileList);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("{id}")
    public void deleteProduct(@PathVariable Integer id) {
        service.remove(id);
    }

    @PutMapping("like")
    public Map<String, Object> likeProduct(@RequestBody Map<String, Object> likeInfo, Authentication authentication) {
        return service.like(likeInfo, authentication);
    }

    @GetMapping("like/{userId}")
    public List<Integer> getLike(@PathVariable Integer userId, Authentication authentication) {
        return service.getLike(userId, authentication);
    }
}
