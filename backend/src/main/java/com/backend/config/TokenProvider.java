package com.backend.config;

import com.backend.domain.user.CustomOauth2UserDetails;
import com.backend.domain.user.User;
import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class TokenProvider {
    private final JwtEncoder jwtEncoder;
    private final UserMapper userMapper;

    public String generateToken(Authentication authentication) {

        CustomOauth2UserDetails details = (CustomOauth2UserDetails) authentication.getPrincipal();
        Map<String, Object> attributes = (Map<String, Object>) details.getAttributes().get("response");
        if (attributes == null) {
            attributes = (Map<String, Object>) details.getAttributes();
        }
        String email = (String) attributes.get("email");
        if (email == null) {
            Map<String, Object> kakao = (Map<String, Object>) attributes.get("kakao_account");
            email = (String) kakao.get("email");
        }

        User db = userMapper.selectUserByEmail(email);
        List<String> authorities = userMapper.selectAuthoritiesByUserId(db.getId());
        String authorityString = "user";
        if (authorities != null) {
            db.setAuthority(authorities);
            authorityString = db.getAuth();
        }

        String profileImage = "";
        String fileName = userMapper.selectFileNameByUserId(db.getId());
        if (fileName != null) {
            profileImage = STR."https://study34980.s3.ap-northeast-2.amazonaws.com/prj3/user/\{db.getId()}/\{fileName}";
        }

        Instant now = Instant.now();

        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuer("LiveAuction")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                .subject(db.getId().toString())
                .claim("nickName", db.getNickName())
                .claim("scope", authorityString)
                .claim("email", db.getEmail())
                .claim("profileImage", profileImage)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
    }

}
