package com.backend.config;

import com.backend.domain.User.User;
import com.backend.jwt.JwtUtil;
import com.backend.mapper.User.UserMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserMapper mapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("token is null");
            filterChain.doFilter(request, response);

            return;
        }

        System.out.println("authorization now");
        // Bearer 제거 후 토큰 획득
        String token = authorization.split(" ")[1];

        if (jwtUtil.isExpired(token)) {
            System.out.println("token is expired");
            filterChain.doFilter(request, response);

            return;
        }

        String username = jwtUtil.getUsername(token);

        if (username != null) {

            User user = mapper.selectUserByEmail(username);
            List<String> authorities = mapper.selectAuthoritiesByUserId(user.getId());
            user.setAuthority(authorities);
            user.setPassword("");

            PrincipalDetails principalDetails = new PrincipalDetails(user);

            System.out.println("context에 authentication 저장");
            Authentication auth = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}