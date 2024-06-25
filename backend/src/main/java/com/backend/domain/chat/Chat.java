package com.backend.domain.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;
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

}