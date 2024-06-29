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
    private LocalDateTime insertedAll;

    private List<QuestionFile> fileList;

    private Integer numberOfCount;
    private Integer numberOfFiles;
    private Integer numberOfComments;
    private Boolean isNewBadge;
    private Boolean secretWrite; //비밀글이면 TRUE, 아니면 FALSE
    private Integer prevId;
    private Integer nextId;

    public String getInserted() {
        LocalDateTime midnightToday = LocalDateTime.now().with(LocalTime.MIDNIGHT);

        if (inserted.isBefore(midnightToday)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return inserted.format(formatter);
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH시 mm분");
            return inserted.format(formatter);
        }
    }

    public Boolean getIsNewBadge() {
        Duration duration = Duration.between(inserted, LocalDateTime.now());
        return duration.toHours() < 48;
    }

    public String getInsertedAll() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return inserted.format(formatter);
    }
}
