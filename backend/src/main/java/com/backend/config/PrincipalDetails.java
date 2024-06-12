package com.backend.config;

import com.backend.domain.User.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class PrincipalDetails implements UserDetails, OAuth2User {
    private User user;
    private Map<String, Object> attributes;

    // 일반 로그인
    public PrincipalDetails(User user) {
        this.user = user;
    }

    // OAuth 로그인
    public PrincipalDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public String getId() {
        return String.valueOf(user.getId());
    }

    public String getNickName() {
        return user.getNickName();
    }

    @Override
    public String getName() {
        return user.getEmail();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> roles = new ArrayList<>();
        for (String role : user.getAuth().split(",")) {
            roles.add(new SimpleGrantedAuthority(role));
        }
        if (user.getAuth().equals("")) {
            roles.add(new SimpleGrantedAuthority("user"));
        }
        return roles;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 악성 회원이면 계정 잠김
    // TODO. 잠긴 회원일 경우 토스트로 알려주기
    @Override
    public boolean isAccountNonLocked() {
        if (user.getBlackCount() > 4) {
            return false;
        }
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
