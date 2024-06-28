package com.backend.domain.board;

import com.backend.domain.user.UserFile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardComment {
    private Integer id;
    private Integer boardId;
    private Integer userId;
    private String nickName;
    private UserFile profileImage;
    
    private String content;
    private LocalDateTime inserted;
    private Integer commentId;
    private Integer commentSeq;
    private Integer refId;


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
