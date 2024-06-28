package com.backend.service.user;

import com.backend.component.SmsUtil;
import com.backend.domain.user.User;
import com.backend.domain.user.UserFile;
import com.backend.mapper.user.UserMapper;
import com.backend.service.product.ProductService;
import com.backend.util.PageInfo;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.Instant;
import java.util.*;


@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Log4j2
public class UserService {
    private final UserMapper mapper;
    private final SmsUtil sms;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final S3Client s3Client;
    private final ProductService productService;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    Timer timer = new Timer();

    public String sendMessage(String phoneNumber) {
        String verificationCode = Integer.toString((int) (Math.random() * 8999) + 1000);
        // TODO. 주석풀기
//        SingleMessageSentResponse response = sms.sendOne(phoneNumber, verificationCode);

        Integer dbCode = mapper.selectCodeByPhoneNumber(phoneNumber);
        if (dbCode != null) {
            mapper.deleteCodeByPhoneNumber(phoneNumber);
        }

//        if (response.getStatusCode().equals("2000")) {
        mapper.insertCode(phoneNumber, verificationCode);
//        }

        TimerTask timeOutCodeDelete = new TimerTask() {
            public void run() {
                Integer leftCode = mapper.selectCodeByPhoneNumber(phoneNumber);
                if (leftCode != null) {
                    mapper.deleteCodeByVerificationCode(leftCode);
                }
            }
        };

        timer.schedule(timeOutCodeDelete, 180000);

        return verificationCode;
    }

    @PreDestroy
    public void destroy() {
        timer.cancel();
    }

    public boolean checkVerificationCode(String phoneNumber, int verificationCode) {
        Integer dbCode = mapper.selectCodeByPhoneNumber(phoneNumber);

        if (dbCode == null) {
            return false;
        }

        if (verificationCode != dbCode) {
            return false;
        }

        mapper.deleteCodeByPhoneNumber(phoneNumber);

        return true;
    }

    public void addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        mapper.insertUser(user);
    }

    public Map<String, Object> issueToken(User user) {
        Map<String, Object> result = new HashMap<>();

        User db = mapper.selectUserByEmail(user.getEmail());
        String fileSrc = "";
        String fileName = mapper.selectFileNameByUserId(db.getId());
        System.out.println("fileName = " + fileName);
        if (fileName != null) {
            fileSrc = STR."\{srcPrefix}user/\{db.getId()}/\{fileName}";
            System.out.println("fileSrc = " + fileSrc);
        }

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
                            .claim("profileImage", fileSrc)
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
        user.setPhoneNumber(user.getPhoneNumber().replaceAll("-", ""));

        if (emailDB != null) {
            return false;
        }

        if (nickNameDB != null) {
            return false;
        }

        if (user.getEmail().trim().isEmpty() || user.getEmail().length() > 30) {
            return false;
        }
        if (user.getPassword().trim().isEmpty()) {
            return false;
        }
        if (user.getNickName().trim().isEmpty() || user.getNickName().length() > 10) {
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

        // 회원 가입 시 비밀번호가 정규식 일치하는지 & 혹은 Oauth 로그인인지 확인
        String passwordPattern = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$";
        return user.getPassword().trim().matches(passwordPattern);
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
        User user = mapper.selectUserById(id);
        String fileName = mapper.selectFileNameByUserId(id);
        UserFile userFile = UserFile.builder()
                .fileName("null").src("null").build();
        if (fileName != null) {
            userFile = UserFile.builder()
                    .fileName(fileName).src(STR."\{srcPrefix}user/\{user.getId()}/\{fileName}").build();
        }
        user.setProfileImage(userFile);
        return user;
    }

    public void removeUserById(Integer id) {

        // 권한 지우기
        mapper.deleteAuthorityById(id);
        // 프로필 사진 지우기
        mapper.deleteProfileImageById(id);

        // 상품 지우기
        List<Integer> productIdList = mapper.selectProductIdByUserId(id);
        productIdList.forEach(productService::remove);

        // 회원 지우기
        mapper.deleteUserById(id);
    }

    public Map<String, Object> updateUser(User user, Authentication authentication, MultipartFile profileImage) throws IOException {
        String fileSrc = "";
        if (profileImage != null) {
            // jwt 토큰에 넣을 ec2 file path
            fileSrc = STR."\{srcPrefix}user/\{user.getId()}/\{profileImage.getOriginalFilename()}";

            String dbFileName = mapper.selectFileNameByUserId(user.getId());

            if (dbFileName == null) {
                mapper.insertProfileImage(user.getId(), profileImage.getOriginalFilename());
            } else {
                mapper.updateProfileImage(user.getId(), profileImage.getOriginalFilename());
                String key = STR."prj3/user/\{user.getId()}/\{dbFileName}";
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteObjectRequest);
            }

            String key = STR."prj3/user/\{user.getId()}/\{profileImage.getOriginalFilename()}";
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(profileImage.getInputStream(), profileImage.getSize()));
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            User db = mapper.selectUserById(user.getId());
            user.setPassword(db.getPassword());
        }
        mapper.updateUser(user);

        Jwt jwt = (Jwt) authentication.getPrincipal();

        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);
        jwtClaimsSetBuilder.claim("nickName", user.getNickName());
        if (!fileSrc.equals("")) {
            jwtClaimsSetBuilder.claim("profileImage", fileSrc);
        }

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
        return passwordEncoder.matches(user.getOldPassword(), db.getPassword());
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
