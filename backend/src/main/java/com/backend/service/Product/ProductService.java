package com.backend.service.Product;

import com.backend.domain.Product.Product;
import com.backend.mapper.Product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper mapper;

    public void upload(Product product, MultipartFile[] files) {
        mapper.insert(product);

        //파일 추가
        if (files != null) {
            for (MultipartFile file : files) {
                // DB 저장
                mapper.insertFile(product.getId(), file.getOriginalFilename());
            }
        }
    }
}
