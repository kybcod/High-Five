package com.backend.domain.question;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
public class QuestionComment {
    private Integer id;
    private Integer questionId;
    private Integer userId;
    private String content;
    private LocalDateTime inserted;
    private String nickName;

    public String getInserted() {
        return inserted.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
