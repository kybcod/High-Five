package com.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtEncoder;

@RequiredArgsConstructor
public class TokenProvider {
    private final JwtEncoder jwtEncoder;

//    private String generateToken(Authentication authentication, long expireTime) {
//        Instant now = Instant.now();
//    }

}
