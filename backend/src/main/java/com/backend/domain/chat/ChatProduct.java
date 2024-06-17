package com.backend.domain.chat;

import lombok.Data;

@Data
public class ChatProduct {
    private Integer id;
    private String title;
    private Integer status;
    private Integer buyerId;
}
