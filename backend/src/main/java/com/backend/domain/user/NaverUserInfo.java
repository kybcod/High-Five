package com.backend.domain.user;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo {
    private Map<String, Object> attributes;

    public NaverUserInfo(Map<String, Object> attributes) {

        this.attributes = attributes;
    }

    // naver OAuth2로부터 받은 사용자 정보 추출
    @Override
    public String getProviderId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getNickName() {
        return (String) attributes.get("nickname");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    public String getPhoneNumber() {
        String phoneNumber = (String) attributes.get("mobile");
        return phoneNumber.replaceAll("-", "");
    }
}
