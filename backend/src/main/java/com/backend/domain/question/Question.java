package com.backend.domain.question;

import lombok.Data;

import java.time.Duration;
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

    private Integer numberOfCount;
    private Integer numberOfFiles;
    private Integer numberOfComments;
    private Boolean isNewBadge;

//    public String getInserted() {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd HH:mm");
//        return inserted.format(formatter);
//    }

    public String getInserted() {
        LocalDateTime beforeOneDay = LocalDateTime.now().minusDays(1);

        if (inserted.isBefore(beforeOneDay)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return inserted.format(formatter).toString();
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            return inserted.format(formatter).toString();
        }
    }

    public Boolean isNewBadge() {
        Duration duration = Duration.between(inserted, LocalDateTime.now());
        return duration.toHours() < 24;
    }
}
