package com.backend.domain.user;

public interface OAuth2UserInfo {
    String getEmail();

    String getProvider();

    String getProviderId();

    String getNickName();
}
