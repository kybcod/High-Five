package com.backend.domain.question;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionComment {
    private Integer id;
    private Integer questionId;
    private Integer userId;
    private String content;
    private LocalDateTime inserted;
}
