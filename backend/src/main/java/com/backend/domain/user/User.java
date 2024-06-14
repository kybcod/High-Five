package com.backend.domain.user;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class User {
    private Integer id;
    private String email;
    private String password;
    private String oldPassword;
    private String nickName;
    private String phoneNumber;
    private Integer blackCount;
    private LocalDateTime inserted;
    private List<String> authority;

    public String getAuth() {
        String auth = "";
        if (authority != null) {
            auth = authority.stream()
                    .collect(Collectors.joining(" "));
        }
        return auth;
    }
}
