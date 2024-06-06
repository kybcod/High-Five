package com.backend.domain.Product;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Product {
    private Integer id;
    private String title;
    private Integer userId;
    private String category;
    private String startPrice;
    private Boolean status;
    private String content;
    private LocalDateTime startTime; //게시글 등록 시간
    private LocalDateTime endTime;
    private int viewCount;
    private Boolean reviewStatus;
    private List<ProductFile> productFileList;
}
