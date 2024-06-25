package com.backend.service.auction;

import com.backend.domain.auction.BidList;
import com.backend.domain.auction.Payment;
import com.backend.mapper.auction.PaymentMapper;
import com.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentMapper mapper;
    private final ProductMapper productMapper;

    @Description("결제할 상품 조회")
    public Map<String, Object> getPayment(Integer userId, Integer productId) {
        return mapper.selectPaymentInfo(userId, productId);
    }

    @Description("결제하고 추가하기")
    public Payment insertPayment(Payment payment) {
        int insertCount = mapper.insert(payment);
        if (insertCount == 1) {
            // 상품 아이디 조회
            BidList bidList = mapper.selectBidListProductIdById(payment.getBidListId());
            // 거래 완료 되면 payment_status true(1)로 바꿈
            productMapper.updatePaymentStatus(bidList.getProductId(), true);
        }
        return payment;
    }
}
