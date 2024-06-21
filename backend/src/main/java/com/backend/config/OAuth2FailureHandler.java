package com.backend.config;

import com.backend.domain.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        System.out.println("failure Handler 실행");

        if (exception instanceof OAuth2AuthenticationException) {

            OAuth2AuthenticationException authException = (OAuth2AuthenticationException) exception;
            String error = authException.getError().getErrorCode();
            System.out.println("error = " + error);
            if ("phone_number_required".equals(authException.getError().getErrorCode())) {
                HttpSession session = request.getSession(false);
                System.out.println("session = " + session);

                if (session != null) {
                    System.out.println("session이 null이 아님");
                    User user = (User) session.getAttribute("user");
                    if (user != null) {
                        System.out.println("user가 null이 아님");
                        String email = user.getEmail();
                        String nickName = user.getNickName();
                        String redirectUrl = String.format("http://localhost:5173/signup/phone_number?email=%s&nickName=%s",
                                URLEncoder.encode(email, "UTF-8"), URLEncoder.encode(nickName, "UTF-8"));
                        response.sendRedirect(redirectUrl);
                        return;
                    }
                }
            }
        }
        response.sendRedirect("/login?error");
    }
}
