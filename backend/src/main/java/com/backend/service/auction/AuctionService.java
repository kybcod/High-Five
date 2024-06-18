package com.backend.service.auction;

import com.backend.domain.auction.BidList;
import com.backend.mapper.auction.AuctionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionMapper mapper;


    //TODO:hasAccess 수정하기
    //userId 받고 있는지 확인하기 위해 즉 로그인 했는지
    public boolean hasAccess(Integer id, Authentication authentication) {
//            Product product = mapper.selectById(id);
//            return product.getUserId().equals(Integer.valueOf(authentication.getName()));
        return false;
    }

    public void upsertBidPrice(BidList bid) {
        if (mapper.existsBid(bid.getProductId(), bid.getUserId())) {
            mapper.updateBidPrice(bid);
        } else {
            mapper.insertBidPrice(bid);
        }
    }

}
