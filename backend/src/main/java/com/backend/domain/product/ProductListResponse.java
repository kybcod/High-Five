package com.backend.domain.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductListResponse {
    private ProductWithUserDTO product;
    private ProductLike productLike;
    private List<ProductFile> productFileList;
}
