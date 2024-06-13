package com.backend.domain.Chat;

import lombok.Data;

@Data
public class ChatMessage {
    private Integer roomId;
    private Integer userId;
    private String message;
}
