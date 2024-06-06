package com.backend.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String email;
    private String password;
    private String nickName;
    private String phoneNumber;
    private Integer blackCount;
    private LocalDateTime inserted;
}
