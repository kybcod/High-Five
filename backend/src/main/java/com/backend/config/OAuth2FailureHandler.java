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
        // TODO. 주석 삭제
//        System.out.println("failure Handler 실행");

        if (exception instanceof OAuth2AuthenticationException) {

            OAuth2AuthenticationException authException = (OAuth2AuthenticationException) exception;
            String error = authException.getError().getErrorCode();
            // TODO. 주석 삭제
            System.out.println("error = " + error);
            if ("phone_number_required".equals(authException.getError().getErrorCode())) {
                HttpSession session = request.getSession(false);
                // TODO. 주석 삭제
                System.out.println("session = " + session);

                if (session != null) {
                    // TODO. 주석 삭제
                    System.out.println("session이 null이 아님");
                    User user = (User) session.getAttribute("user");
                    if (user != null) {
                        // TODO. 주석 삭제
                        System.out.println("user가 null이 아님");
                        String email = user.getEmail();
                        String nickName = user.getNickName();
                        String phoneNumber = "";
                        if (user.getPhoneNumber() != null) {
                            String regEx = "(\\d{3})(\\d{4})(\\d{4})";
                            phoneNumber = user.getPhoneNumber().replaceAll(regEx, "$1-$2-$3");
                        }
                        String redirectUrl = String.format("http://localhost:5173/signup/phone_number?email=%s&nickName=%s&phoneNumber=%s",
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
