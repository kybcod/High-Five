package com.backend.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private Integer id;
    private Integer user_id;
    private String title;
    private String content;
    private LocalDateTime inserted;
}
