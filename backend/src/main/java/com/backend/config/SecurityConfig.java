package com.backend.config;

import com.backend.service.user.Oauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final Oauth2UserService oauth2UserService;
    private final OAuth2SuccessHandler oauth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // deprecated 된 것들 람다식으로 변경
        http.csrf(csrf -> csrf.disable());

        http.authorizeHttpRequests(authorize -> authorize
                .anyRequest()
                .permitAll()
        );

        http.oauth2Login(oauth2 -> oauth2
                // 사용자 정보 엔드포인트에 대한 설정 추가
                .userInfoEndpoint(infoEndpoint ->
                        // 사용자 서비스 구성(로그인 성공 후 사용자 정보 처리)
                        infoEndpoint.userService(oauth2UserService)).successHandler(oauth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler)
        );

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}
