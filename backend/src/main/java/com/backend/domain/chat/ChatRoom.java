package com.backend.domain.chat;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRoom {
    private Integer id;
    private Integer productId;
    private Integer sellerId;
    private String sellerName;
    private Integer userId;
    private String userName;
    private LocalDateTime inserted;
}
