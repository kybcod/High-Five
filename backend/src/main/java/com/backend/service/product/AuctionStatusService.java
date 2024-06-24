package com.backend.service.product;

import com.backend.domain.product.Product;
import com.backend.service.auction.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class AuctionStatusService {

    private final AuctionService auctionService;
    private final ProductService productService;


    // TODO : Mapper 정리
    public void updateProductState() {
        // 0: 판매종료(false)
        // 1:판매중(true) => 기본값

        LocalDateTime currentTime = LocalDateTime.now();
        List<Product> productList = productService.selectProductAndBidList();

        for (Product product : productList) {
            if (product.getEndTime().isBefore(currentTime) && product.getStatus()) {
                product.setStatus(false);
                productService.updateStatus(product); //판매 종료
                auctionService.updateBidStatus(product.getId()); // 낙찰
            }
            System.out.println("currentTime = " + currentTime);
            System.out.println(STR."\{product.getTitle()} : 끝나는 시간(\{product.getEndTime()}) , 상품 상태 : \{product.getStatus()}");
        }
    }
}
