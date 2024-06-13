package com.backend.domain.Question;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
public class Question {
    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private String nickName;
    private LocalDateTime inserted;

    private List<QuestionFile> fileList;

    public String getInserted() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH:mm");
        return inserted.format(formatter);
    }


}
