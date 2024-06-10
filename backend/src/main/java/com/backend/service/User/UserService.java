package com.backend.service.User;

import com.backend.component.SmsUtil;
import com.backend.domain.User.User;
import com.backend.mapper.User.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
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

        User db = mapper.getUserByEmail(user.getEmail());

        if (db != null) {
            if (passwordEncoder.matches(user.getPassword(), db.getPassword())) {
                result = new HashMap<>();
                String token = "";
                Instant now = Instant.now();

                // TODO. db에서 권한 정보 가져오기, token에 권한 추가

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("LiveAuction")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(60 * 60 * 24))
                        .subject(db.getId().toString()) // 토큰에서 사용자에 대한 식별 값
                        .claim("nickName", db.getNickName())
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
}
