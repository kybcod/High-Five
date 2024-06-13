package com.backend.component;

import com.backend.config.PrincipalDetails;
import com.backend.mapper.User.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service("CustomAuth")
@Slf4j
public class CustomAuth {
    private final UserMapper mapper;

    public boolean isSelf(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String authId = principalDetails.getId();
        String email = mapper.selectEmailById(Integer.valueOf(id));

        System.out.println("어노테이션 체크 = " + principalDetails.getUsername().equals(email));
        return principalDetails.getUsername().equals(email);
    }
}
