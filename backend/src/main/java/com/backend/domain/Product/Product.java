package com.backend.domain.Product;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private Boolean productLike;
    private Integer numberOfJoin;
    private String userNickName;

    public String getEndTimeFormat() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd HH시 mm분 까지");
        return endTime.format(formatter);
    }

    public String getEndTimeDetailsFormat() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 까지");
        return endTime.format(formatter);
    }

    public String getStartTimeFormat() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
        return startTime.format(formatter);
    }
}
