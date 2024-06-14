package com.backend.domain.question;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionComment {
    private String id;
    private String question_id;
    private String user_id;
    private String content;
    private LocalDateTime inserted;

}
