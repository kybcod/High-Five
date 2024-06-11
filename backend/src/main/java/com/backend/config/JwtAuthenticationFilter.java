package com.backend.config;

import com.backend.domain.User.LoginRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {

        ObjectMapper om = new ObjectMapper();
        LoginRequestDto loginRequestDto = null;
        try {
            loginRequestDto = om.readValue(request.getInputStream(), LoginRequestDto.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getUsername(),
                        loginRequestDto.getPassword());

        Authentication authentication =
                authenticationManager.authenticate(authenticationToken);

        return authentication;
    }

//    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
//                                            Authentication authResult) throws IOException, ServletException {
//
//        PrincipalDetails principalDetailis = (PrincipalDetails) authResult.getPrincipal();
//        User db = mapper.selectUserByEmail(principalDetailis.getUsername());
//
//        String jwtToken = "";
//        Instant now = Instant.now();
//
//        List<String> authorities = mapper.selectAuthoritiesByUserId(db.getId());
//        String authorityString = authorities.stream()
//                .collect(Collectors.joining(" "));
//
//        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
//                .issuer("LiveAuction")
//                .issuedAt(now)
//                .expiresAt(now.plusSeconds(60 * 60 * 24))
//                .subject(db.getEmail())
//                .claim("nickName", db.getNickName())
//                .claim("authority", authorityString)
//                .claim("id", db.getId().toString())
//                .build();
//
//        jwtToken = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
//
//        response.addHeader("Authentication", STR."Bearer \{jwtToken}");
//    }
}
