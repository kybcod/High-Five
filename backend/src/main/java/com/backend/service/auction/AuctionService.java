package com.backend.service.auction;

import com.backend.domain.auction.BidList;
import com.backend.domain.product.Product;
import com.backend.mapper.auction.AuctionMapper;
import com.backend.mapper.product.ProductMapper;
import com.backend.service.product.ProductService;
import com.backend.util.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionMapper mapper;
    private final ProductMapper productMapper;
    private final ProductService productService;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;


    //userId 받고 있는지 확인하기 위해 즉 로그인 했는지
    public boolean hasAccess(Integer id, Authentication authentication) {
        Product product = productMapper.selectById(id);
        return product.getUserId().equals(Integer.valueOf(authentication.getName()));
    }

    public void upsertBidPrice(BidList bid) {
        if (mapper.existsBid(bid.getProductId(), bid.getUserId())) {
            mapper.updateBidPrice(bid);
        } else {
            mapper.insertBidPrice(bid);
        }
    }

    public Map<String, Object> getBidListByUserId(Integer userId, Pageable pageable) {

        // 해당 userId가 입찰에 참여한 bid(productList)
        List<BidList> bidList = mapper.selectBidListByUserIdWithPagination(userId, pageable);
        productService.settingFilePath(bidList.stream().map(BidList::getProduct).toList());

        // 더보기 : 페이지
        int total = mapper.selectTotalCountBidsByUserId(userId);
        Page<BidList> page = new PageImpl<>(bidList, pageable, total);
        PageInfo pageInfo = new PageInfo().setting(page);
        boolean hasNextPage = pageable.getPageNumber() + 1 < page.getTotalPages();

        return Map.of("bidList", bidList, "pageInfo", pageInfo, "hasNextPage", hasNextPage);

    }

    // 경매 참여 시 입찰 상태 true로 업데이트
    public void updateBidStatus(Integer productId) {
        BidList maxBid = mapper.selectMaxPriceByProductId(productId);
        if (maxBid != null) {
            mapper.updateBidStatusByProductId(maxBid.getId(), true);
        }
    }
}
