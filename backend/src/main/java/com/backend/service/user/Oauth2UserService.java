package com.backend.service.user;

import com.backend.domain.user.*;
import com.backend.mapper.user.UserMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class Oauth2UserService extends DefaultOAuth2UserService {
    private final UserMapper mapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // TODO. 주석 삭제
//        System.out.println("userRequest.getAccessToken().getTokenValue() = " + userRequest.getAccessToken().getTokenValue());
//        System.out.println("userRequest.getClientRegistration() = " + userRequest.getClientRegistration());
//        System.out.println("userRequest.getClientRegistration().getRegistrationId() = " + userRequest.getClientRegistration().getRegistrationId());

        OAuth2User oAuth2User = super.loadUser(userRequest); //네이버 사용자 정보 로드
        // TODO. 주석 삭제
//        System.out.println("oAuth2User = " + oAuth2User.getAttributes());

        String platform = userRequest.getClientRegistration().getRegistrationId(); //로그인한 클라이언트의 등록 ID

        // TODO. 주석 삭제
        OAuth2UserInfo response = null;
        if (platform.equals("naver")) {
//            System.out.println("네이버 로그인 요청");
            response = new NaverUserInfo((Map) oAuth2User.getAttributes().get("response")); //네이버에 있는 사용자 정보 추출
//            System.out.println(response);
        } else if (platform.equals("kakao")) {
//            System.out.println("카카오 로그인 요청");
            response = new KakaoUserInfo((Map) oAuth2User.getAttributes());//카카오에 있는 사용자 정보 추출
            System.out.println("response = " + response);
        } else if (platform.equals("google")) {
//            System.out.println("구글 로그인 요청");
            response = new GoogleUserInfo((Map) oAuth2User.getAttributes());
//            System.out.println("response = " + response);
        }
        // TODO. sns login

        // DB에 저장
        User user = mapper.selectUserByEmail(response.getEmail());
        if (user == null) {
            user = User
                    .builder()
                    .email(response.getEmail())
                    .nickName(response.getNickName())
                    .password(userRequest.getAccessToken().getTokenValue())
                    .build();

            String profileImage = response.getProfileImage();
            if (profileImage != null) {
                // TODO. user 정보 변경 후 주석 해제
//                user.setProfileImage(profileImage);
            }

            // 네이버에서 받은 이메일 조회 후 해당 이메일이 없는 경우 insert
            if (platform.equals("naver")) {
                // TODO. 주석 삭제
//                System.out.println("최초");
                user.setPhoneNumber(response.getPhoneNumber());
                mapper.insertUser(user);
//            mapper.insertProfileImage(user.getId(), response.getProfileImage());
            } else {
                HttpSession httpSession = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession();
                httpSession.setAttribute("user", user);
                throw new OAuth2AuthenticationException(new OAuth2Error("phone_number_required", "Phone number is required", ""));
            }
        }

        if (platform.equals("naver")) {
            return new CustomOauth2UserDetails(user, (Map<String, Object>) oAuth2User.getAttributes().get("response"));
        } else {
            System.out.println("카카오, 또는 구글 로그인 실행");
            return new CustomOauth2UserDetails(user, oAuth2User.getAttributes());
        }
    }
}
