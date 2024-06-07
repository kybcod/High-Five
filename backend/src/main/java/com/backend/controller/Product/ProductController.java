package com.backend.controller.Product;


import com.backend.domain.Product.Product;
import com.backend.service.Product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
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
    public void upload(Product product,
                       @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        service.upload(product, files);
    }

    @GetMapping
    public List<Product> list(Integer id) {
        return service.list(id);
    }

    @GetMapping("list")
    public Map<String, Object> getListProduct(@RequestParam(defaultValue = "1") int page) {
        Map<String, Object> test = service.getList(PageRequest.of(page - 1, 20));
        return test;
    }

}
