package com.backend.jwt;

import com.backend.domain.User.User;
import com.backend.mapper.User.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class JwtUtil {
    private final JwtDecoder jwtDecoder;
    private final JwtEncoder jwtEncoder;
    private final UserMapper mapper;

    public String getUsername(String token) {

        System.out.println("JwtUtil username = " + jwtDecoder.decode(token).getSubject());
        return jwtDecoder.decode(token).getSubject();
    }

    public String getRole(String token) {

        System.out.println("JwtUtil role = " + jwtDecoder.decode(token).getClaim("scope"));
        return jwtDecoder.decode(token).getClaim("scope");
    }

    public Boolean isExpired(String token) {

        System.out.println("JwtUtil isExpired = " + jwtDecoder.decode(token).getExpiresAt().isBefore(Instant.now()));
        return jwtDecoder.decode(token).getExpiresAt().isBefore(Instant.now());
    }

    public String createJwt(String username) {

        User db = mapper.selectUserByEmail(username);
        List<String> authorities = mapper.selectAuthoritiesByUserId(db.getId());
        String authorityString = authorities.stream()
                .collect(Collectors.joining(" "));

        JwtClaimsSet claimSet = JwtClaimsSet.builder()
                .issuer("LiveAuction")
                .subject(db.getEmail())
                .claim("nickName", db.getNickName())
                .claim("id", db.getId().toString())
                .claim("scope", authorityString)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24))
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claimSet)).getTokenValue();

        System.out.println("token = " + token);
        return token;
    }
}
