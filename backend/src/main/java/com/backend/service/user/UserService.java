package com.backend.service.user;

import com.backend.component.SmsUtil;
import com.backend.domain.user.User;
import com.backend.mapper.user.UserMapper;
import com.backend.util.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
//        SingleMessageSentResponse response = sms.sendOne(phoneNumber, verificationCode);

        Integer dbCode = mapper.selectCodeByPhoneNumber(phoneNumber);
        if (dbCode != null) {
            mapper.deleteCodeByPhoneNumber(phoneNumber);
        }

        mapper.insertCode(phoneNumber, verificationCode);
//        if (response.getStatusCode().equals("2000")) {
//        }
        return verificationCode;
    }

    public boolean checkVerificationCode(String phoneNumber, int verificationCode) {
        Integer dbCode = mapper.selectCodeByPhoneNumber(phoneNumber);
        if (dbCode != null) {
            mapper.deleteCodeByPhoneNumber(phoneNumber);
        }
        return verificationCode == dbCode;
    }

    public void addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        mapper.insertUser(user);
    }

    public Map<String, Object> issueToken(User user) {

        Map<String, Object> result = new HashMap<>();

        User db = mapper.selectUserByEmail(user.getEmail());

        if (db != null) {
            if (passwordEncoder.matches(user.getPassword(), db.getPassword())) {
                if (db.getBlackCount() == null || db.getBlackCount() < 5) {

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
                } else {
                    result.put("message", "신고 누적으로 정지된 유저입니다");
                }
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
        // TODO. 지울것이 산더미,,

        // 권한 지우기
        mapper.deleteAuthorityById(id);

        // chatMapper
        // 채팅룸 지우기
        // 메시지 지우기
        // 경매내역 지우기

        // boardMapper
        // 자유 게시물 파일 지우기
        // 자유 게시물 좋아요 지우기
        // 자유 게시물 댓글 지우기
        // 자유 게시물 지우기

        // questionMapper
        // QnA 게시물 파일 지우기
        // QnA 게시물 좋아요 지우기
        // QnA 게시물 댓글 지우기
        // QnA 게시물 지우기

        // productMapper
        // 상품 좋아요 지우기
        // 상품 파일 지우기
        // 상품 리뷰 지우기
        // 상품 게시물 지우기

        // 회원 지우기
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

    public boolean identificationToModify(User user) {
        User db = mapper.selectUserById(user.getId());
        return passwordEncoder.matches(user.getOldPassword(), db.getPassword());
    }

    public boolean identificationToDelete(User user, Authentication authentication) {
        User db = mapper.selectUserById(Integer.valueOf(authentication.getName()));
        if (user.getId() != db.getId()) {
            return false;
        }
        if (!passwordEncoder.matches(user.getOldPassword(), db.getPassword())) {
            return false;
        }

        return true;
    }

    public Map<String, Object> getUserList(int page, String type, String keyword) {
        int offset = (page - 1) * 10;
        Pageable pageable = PageRequest.of(page - 1, 10);
        List<User> userList = mapper.selectUserList(offset, type, keyword);

        int totalUserNumber = mapper.selectTotalUserCount();
        Page<User> pageImpl = new PageImpl<>(userList, pageable, totalUserNumber);
        PageInfo paeInfo = new PageInfo().setting(pageImpl);

        return Map.of("userList", userList, "pageInfo", paeInfo);
    }

    public void reportUserById(Integer id) {
        mapper.updateBlackCountByUserId(id);
    }

    public String getEmailByPhoneNumber(String phoneNumber) {
        return mapper.selectEmailByPhoneNumber(phoneNumber);
    }

    public boolean modifyPassword(User user) {
        User dbUser = getUserByEmail(user.getEmail());
        if (dbUser != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            mapper.updatePassword(user);
            return true;
        }
        return false;
    }
}
