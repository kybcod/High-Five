package com.backend.controller.auction;

import com.backend.domain.auction.BidList;
import com.backend.service.auction.AuctionService;
import com.backend.service.product.AuctionStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bids")
public class AuctionController {

    private final AuctionService service;
    private final AuctionStatusService auctionStatusService;

    @Description("경매 참여하기")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity joinProduct(@RequestBody BidList bid, Authentication authentication) {
        //클라이언트로 부터 받은 userId(상품의 주인)와 토큰을 가지고 있는 userId가 같다면 참여 못함
        if (service.hasAccess(bid.getProductId(), authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            service.upsertBidPrice(bid);
            return ResponseEntity.ok().build();
        }
    }

    @Description("마이페이지 : 입찰 내역")
    @GetMapping("{userId}/list")
    public Map<String, Object> getBids(@PathVariable Integer userId, @RequestParam(defaultValue = "1") int page) {
        return service.getBidListByUserId(userId, PageRequest.of(page - 1, 9));
    }


    //    @Scheduled(cron = "0 0 0/1 * * *", zone = "Asia/Seoul") //1시간
//    @Scheduled(fixedRate = 100000, zone = "Asia/Seoul")
    public void checkEndTimeAndProductState() {
        auctionStatusService.updateProductState();
    }

//    @GetMapping("{userId}/list")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity getBids(@PathVariable Integer userId, Authentication authentication, @RequestParam(defaultValue = "1") int page) {
//        System.out.println(authentication.getName());
//        System.out.println("userId = " + userId);
//        if (!Integer.valueOf(authentication.getName()).equals(userId)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//        }
//        service.getBidListByUserId(userId, PageRequest.of(page - 1, 9));
//        return ResponseEntity.ok().build();
//    }
}
