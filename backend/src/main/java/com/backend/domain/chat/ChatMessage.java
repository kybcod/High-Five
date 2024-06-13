package com.backend.domain.chat;

import lombok.Data;

@Data
public class ChatMessage {
    private Integer roomId;
    private Integer userId;
    private String message;
}
