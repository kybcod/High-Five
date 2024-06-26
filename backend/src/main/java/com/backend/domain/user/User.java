package com.backend.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
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
    private UserFile profileImage;

    public String getAuth() {
        String auth = "";
        if (authority != null) {
            auth = authority.stream()
                    .collect(Collectors.joining(" "));
        }
        return auth;
    }

    public String getSignupDateAndTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초");

        return inserted.format(formatter);
    }

    // -- chatList
    @JsonIgnore
    public Map<String, Object> getUserIdAndNickName() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", getId());
        map.put("nickName", getNickName());
        return map;
    }
}
