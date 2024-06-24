package com.backend.domain.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class Product {
    private Integer id;
    private Integer userId;
    private String title;
    private String category;
    private String startPrice;
    private Boolean status; //상품 판매 상태
    private String content;
    private LocalDateTime startTime; //게시글 등록 시간
    private LocalDateTime endTime;
    private int viewCount;
    private Boolean reviewStatus;
    private Boolean paymentStatus;

    private List<Map<String, Object>> productBidList;
    private List<ProductFile> productFileList;

    private Integer numberOfJoin;
    private String userNickName;
    private String maxBidPrice;


    // 시간 포맷
    public String getTimeFormat() {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(startTime, now);

        if (duration.getSeconds() < 60) {
            return "방금 전";
        } else if (duration.toMinutes() < 60) {
            return duration.toMinutes() + "분 전";
        } else if (duration.toHours() < 24) {
            return duration.toHours() + "시간 전";
        } else if (duration.toDays() < 32) {
            return duration.toDays() + "일 전";
        } else {
            Period period = Period.between(startTime.toLocalDate(), now.toLocalDate());
            if (period.getMonths() > 0) {
                return period.getMonths() + "달 전";
            } else {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
                return startTime.format(formatter);
            }
        }
    }

    public String getEndTimeFormat() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd HH시 까지");
        return endTime.format(formatter);
    }

    public String getEndTimeDetailsFormat() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 까지");
        return endTime.format(formatter);
    }

    public String getStartTimeFormat() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
        return startTime.format(formatter);
    }

    // -- chatList
    @JsonIgnore
    public Map<String, Object> getProductIdAndTitle() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", getId());
        map.put("title", getTitle());
        return map;
    }

    // -- chatRoom
    @JsonIgnore
    public Map<String, Object> getProductStatusInfo() {
        Map<String, Object> map = new HashMap<>(getProductIdAndTitle());
        map.put("status", getStatus());
        map.put("reviewStatus", getReviewStatus());
        map.put("paymentStatus", getPaymentStatus());
        return map;
    }
}
