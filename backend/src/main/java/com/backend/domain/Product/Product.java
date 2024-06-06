package com.backend.domain.Product;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Product {
    private Integer id;
    private Integer userId;
    private String category;
    private String startPrice;
    private Boolean status;
    private String content;
    private LocalDateTime start_time; //게시글 등록 시간
    private LocalDateTime end_time;
    private int view_count;
    private Boolean reviewStatus;
    private List<ProductFile> productFileList;
}
