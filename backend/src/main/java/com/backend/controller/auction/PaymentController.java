package com.backend.controller.auction;

import com.backend.domain.auction.Payment;
import com.backend.service.auction.PaymentService;
import com.siot.IamportRestClient.IamportClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("insert")
    public Payment insertPayment(@RequestBody Payment payment) {
        return service.insertPayment(payment);
    }

}
