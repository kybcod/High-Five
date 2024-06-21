package com.backend.controller.auction;

import com.backend.domain.auction.Payment;
import com.backend.service.auction.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    @GetMapping("{userId}/{productId}")
    public Map<String, Object> getPaymentInfo(@PathVariable Integer userId, @PathVariable Integer productId) {
        return service.getPayment(userId, productId);
    }

    @PostMapping
    public Payment insertPayment(@RequestBody Payment payment) {
        return service.insertPayment(payment);
    }

}
