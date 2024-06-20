package com.backend.service.auction;

import com.backend.mapper.auction.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentMapper mapper;

    public Map<String, Object> getPayment(Integer userId, Integer productId) {
        return mapper.selectPaymentInfo(userId, productId);
    }
}
