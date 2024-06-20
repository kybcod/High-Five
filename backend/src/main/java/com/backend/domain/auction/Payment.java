package com.backend.domain.auction;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class Payment {
    private Integer id;
    private String merchantUid;
    private Integer amount;
    private Integer bidListId;
    private Boolean paidStatus;
    private LocalDateTime inserted;
}
