package com.backend.domain.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Data
public class Chat {
    private Integer id;
    private Integer chatRoomId;
    private Integer userId;
    private String message;
    private LocalDateTime inserted;
    private Boolean readCheck;

    // -- chatList
    @JsonIgnore
    public Map<String, Object> getChatMessageAndInserted() {
        Map<String, Object> map = new HashMap<>();
        map.put("message", getMessage());
        map.put("inserted", getInserted());
        return map;
    }

    @JsonIgnore
    public String getTimeFormat() {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(inserted, now);

        if (duration.getSeconds() < 60) {
            return "방금 전";
        } else if (duration.toMinutes() < 60) {
            return duration.toMinutes() + "분 전";
        } else if (duration.toHours() < 24) {
            return duration.toHours() + "시간 전";
        } else if (duration.toDays() < 32) {
            return duration.toDays() + "일 전";
        } else {
            Period period = Period.between(inserted.toLocalDate(), now.toLocalDate());
            if (period.getMonths() > 0) {
                return period.getMonths() + "달 전";
            } else {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
                return inserted.format(formatter);
            }
        }
    }

}