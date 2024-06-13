package com.backend.domain.user;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
}
