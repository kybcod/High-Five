package com.backend.domain.board;

import lombok.Data;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Data
public class Board {
    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private LocalDateTime inserted;
    private String nickName;

    private List<BoardFile> boardFileList;
    private Integer numberOfImages;
    private Integer numberOfLikes;
    private Integer numberOfComments;

    public String getInserted() {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(inserted, now);
        long minutes = duration.toMinutes();
        long hours = duration.toHours();

        if (minutes < 60) {
            return minutes + "분 전";
        }
        if (hours <= 23) {
            return hours + "시간 전";
        } else {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("a hh:mm:ss").withLocale(Locale.KOREAN);
            LocalDateTime beforeOneDay = now.minusDays(1);

            if (inserted.isBefore(beforeOneDay)) {
                return inserted.format(dateFormatter);
            } else {
                return inserted.format(timeFormatter);
            }
        }
    }
}