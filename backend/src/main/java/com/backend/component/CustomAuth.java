package com.backend.component;

import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service("CustomAuth")
@Slf4j
public class CustomAuth {
    private final UserMapper mapper;

    public boolean isSelf(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String tokenEmail = "";
        String tokenId = "";
        if (!authentication.getName().equals("anonymousUser")) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            tokenEmail = jwt.getClaim("email");
            tokenId = jwt.getClaim("sub");
        }

        String email = mapper.selectEmailById(Integer.valueOf(id));

        return tokenId.equals(id) && tokenEmail.equals(email);
    }
}