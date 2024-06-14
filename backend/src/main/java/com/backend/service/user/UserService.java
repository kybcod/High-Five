package com.backend.service.user;

import com.backend.component.SmsUtil;
import com.backend.domain.user.User;
import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class UserService {
    private final UserMapper mapper;
    private final SmsUtil sms;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public String sendMessage(String phoneNumber) {
        String verificationCode = Integer.toString((int) (Math.random() * 8999) + 1000);
        sms.sendOne(phoneNumber, verificationCode);
        return verificationCode;
    }

    public boolean checkVerificationCode(String verificationCode, String customerCode) {
        if (verificationCode.equals(customerCode)) {
            return true;
        }
        return false;
    }

    public void addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        mapper.insertUser(user);
    }

    public Map<String, Object> issueToken(User user) {

        Map<String, Object> result = null;

        User db = mapper.selectUserByEmail(user.getEmail());

        if (db != null) {
            if (passwordEncoder.matches(user.getPassword(), db.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

                List<String> authorities = mapper.selectAuthoritiesByUserId(db.getId());
                String authorityString = "user";
                if (authorities != null) {
                    user.setAuthority(authorities);
                    authorityString = user.getAuth();
                }

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("LiveAuction")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7))
                        .subject(db.getId().toString())
                        .claim("nickName", db.getNickName())
                        .claim("scope", authorityString)
                        .claim("email", db.getEmail())
                        .build();

                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }

        return result;
    }

    public User getUserByEmail(String email) {
        return mapper.selectUserByEmail(email);
    }

    public User getUserByNickName(String nickName) {
        return mapper.selectUserByNickName(nickName);
    }

    public boolean signUpVerification(User user) {

        User emailDB = mapper.selectUserByEmail(user.getEmail());
        User nickNameDB = mapper.selectUserByNickName(user.getNickName());

        if (emailDB != null) {
            return false;
        }

        if (nickNameDB != null) {
            return false;
        }

        if (user.getEmail().trim().length() == 0 && user.getEmail().length() > 30) {
            return false;
        }
        if (user.getPassword().trim().length() == 0) {
            return false;
        }
        if (user.getNickName().trim().length() == 0 && user.getNickName().length() > 10) {
            return false;
        }
        if (user.getPhoneNumber().trim().length() != 11) {
            return false;
        }

        String emailPattern = "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";
        if (!user.getEmail().trim().matches(emailPattern)) {
            return false;
        }

        String phoneNumberPattern = "^(010)[0-9]{8}$";
        if (!user.getPhoneNumber().trim().matches(phoneNumberPattern)) {
            return false;
        }

        String passwordPattern = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$";
        if (!user.getPassword().trim().matches(passwordPattern)) {
            return false;
        }

        return true;
    }

    // userId로 본인 확인
    public boolean identification(Integer id, Authentication authentication) {
        boolean self = authentication.getName().equals(id.toString());

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("SCOPE_admin"));

        return self || isAdmin;
    }

    public User getUserByUserId(Integer id) {
        return mapper.selectUserById(id);
    }

    public void removeUserById(Integer id) {
        mapper.deleteUserById(id);
    }

    public Map<String, Object> updateUser(User user, Authentication authentication) {
        if (user.getPassword() != null && user.getPassword().length() > 0) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            User db = mapper.selectUserById(user.getId());
            user.setPassword(db.getPassword());
        }
        mapper.updateUser(user);

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Instant now = Instant.now();

        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);
        jwtClaimsSetBuilder.claim("nickName", user.getNickName());

        JwtClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
        return Map.of("token", token);
    }
}
