package com.backend.domain.User;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
}
