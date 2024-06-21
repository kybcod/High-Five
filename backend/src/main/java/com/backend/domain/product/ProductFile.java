package com.backend.domain.product;

import lombok.Data;

@Data
public class ProductFile {
    private Integer productId;
    private String fileName;
    private String filePath; // s3 + filename

    public void setFilePath(String srcPrefix) {
        this.filePath = STR."\{srcPrefix}\{this.productId}/\{fileName}";
    }
}
