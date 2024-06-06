package com.backend.service.Product;

import com.backend.domain.Product.Product;
import com.backend.mapper.Product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper mapper;

    public void uploadProduct(Product product) {
        mapper.insert(product);
    }
}
