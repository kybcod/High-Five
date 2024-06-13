package com.backend.domain.board;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private LocalDateTime inserted;
}
