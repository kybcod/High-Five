package com.backend;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Qna {
    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private LocalDateTime inserted;

    private String file_name;
}
