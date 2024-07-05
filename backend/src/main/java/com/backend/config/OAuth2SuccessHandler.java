package com.backend.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final TokenProvider tokenProvider;
    private static final String URI = "http://3.39.193.68:8080/user/auth/success";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String token = tokenProvider.generateToken(authentication);

        String redirectUrl = UriComponentsBuilder.fromUriString(URI)
                .queryParam("token", token)
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
