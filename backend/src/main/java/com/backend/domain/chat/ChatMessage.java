package com.backend.domain.chat;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessage {
    // TODO : 삭제 예정
    private Integer chatRoomId;
    private Integer userId;
    private String message;
    private LocalDateTime inserted;
}
