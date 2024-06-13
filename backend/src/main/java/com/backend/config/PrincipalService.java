package com.backend.config;

import com.backend.domain.User.User;
import com.backend.mapper.User.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrincipalService implements UserDetailsService {
    private final BCryptPasswordEncoder encoder;
    private final UserMapper mapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("username = " + username);
        User findUser = mapper.selectUserByEmail(username);

        if (findUser != null) {
            List<String> authorities = mapper.selectAuthoritiesByUserId(findUser.getId());
            findUser.setAuthority(authorities);
            return new PrincipalDetails(findUser);
        } else {
            throw new UsernameNotFoundException(username + " not found");
        }
    }
}
