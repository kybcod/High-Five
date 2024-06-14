package com.backend.domain.chat;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Integer chatRoomId;
    private Integer userId;
    private String message;
    private LocalDateTime inserted;
}
