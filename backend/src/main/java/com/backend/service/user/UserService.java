package com.backend.service.user;

import com.backend.component.SmsUtil;
import com.backend.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class UserService {
    private final UserMapper mapper;
    private final SmsUtil sms;

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
}
