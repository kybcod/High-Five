package com.backend.domain.chat;

import lombok.Data;

@Data
public class ChatProduct {
    // TODO : 삭제 예정
    private Integer id;
    private String title;
    private Integer status;
    private Integer buyerId;
    private Integer reviewStatus;
}
