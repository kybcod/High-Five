package com.backend.domain.chat;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
public class ChatRoom {
    private Integer id;
    private Integer productId;
    private Integer sellerId;
    private Integer userId;
    private LocalDateTime inserted;

    // -- chatList
    public Map<String, Object> getChatRoomIdAndBuyerId() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", getId());
        map.put("userId", getUserId());
        return map;
    }
}
