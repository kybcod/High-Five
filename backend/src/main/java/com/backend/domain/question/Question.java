package com.backend.domain.question;

import lombok.Data;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    private Integer numberOfCount;
    private Integer numberOfFiles;
    private Integer numberOfComments;
    private Boolean isNewBadge;

    public String getInserted() {
        LocalDateTime midnightToday = LocalDateTime.now().with(LocalTime.MIDNIGHT);

        if (inserted.isBefore(midnightToday)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return inserted.format(formatter);
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            return inserted.format(formatter);
        }
    }

    public Boolean getIsNewBadge() {
        Duration duration = Duration.between(inserted, LocalDateTime.now());
        return duration.toHours() < 24;
    }

//    public String getInserted() {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd HH:mm");
//        return inserted.format(formatter);
//    }
}
