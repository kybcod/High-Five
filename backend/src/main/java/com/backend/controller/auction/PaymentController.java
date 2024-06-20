package com.backend.controller.auction;

import com.backend.service.auction.PaymentService;
import com.siot.IamportRestClient.IamportClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private IamportClient iamportClient;
    private final PaymentService service;

    @GetMapping("{userId}/{productId}")
    public Map<String, Object> getPaymentInfo(@PathVariable Integer userId, @PathVariable Integer productId) {
        return service.getPayment(userId, productId);
    }
}
