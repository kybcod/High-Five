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

        if (exception instanceof OAuth2AuthenticationException) {

            OAuth2AuthenticationException authException = (OAuth2AuthenticationException) exception;
            String error = authException.getError().getErrorCode();

            if ("phone_number_required".equals(authException.getError().getErrorCode())) {
                HttpSession session = request.getSession(false);

                if (session != null) {
                    User user = (User) session.getAttribute("user");
                    if (user != null) {
                        String email = user.getEmail();
                        String nickName = user.getNickName();
                        String phoneNumber = "";
                        if (user.getPhoneNumber() != null) {
                            String regEx = "(\\d{3})(\\d{4})(\\d{4})";
                            phoneNumber = user.getPhoneNumber().replaceAll(regEx, "$1-$2-$3");
                        }
                        String redirectUrl = String.format("http://3.39.193.68:8080/signup?email=%s&nickName=%s&phoneNumber=%s",
                                URLEncoder.encode(email, "UTF-8"), URLEncoder.encode(nickName, "UTF-8"), URLEncoder.encode(phoneNumber, "UTF-8"));
                        response.sendRedirect(redirectUrl);
                        return;
                    }
                }
            }
        }
        response.sendRedirect("/login?error");
    }
}
