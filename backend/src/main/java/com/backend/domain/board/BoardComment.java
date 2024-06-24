package com.backend.domain.board;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardComment {
    private Integer id;
    private Integer boardId;
    private Integer userId;
    private String nickName;

    private String content;
    private LocalDateTime inserted;
    private Integer commentId;
    private Integer commentSeq;
    private Integer refId;
}
