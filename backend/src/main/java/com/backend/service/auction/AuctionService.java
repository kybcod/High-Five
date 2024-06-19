package com.backend.service.auction;

import com.backend.domain.auction.BidList;
import com.backend.domain.product.Product;
import com.backend.domain.product.ProductFile;
import com.backend.mapper.auction.AuctionMapper;
import com.backend.mapper.product.ProductMapper;
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
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;


    //TODO:hasAccess 수정하기
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

        // 해당 userId가 입찰에 참여한 productList
        List<Product> productList = mapper.selectBidListByUserIdWithPagination(userId, pageable);

        for (Product product : productList) {
            // 파일 저장
            List<String> productFiles = productMapper.selectFileByProductId(product.getId());
            List<ProductFile> files = productFiles.stream()
                    .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                    .toList();
            product.setProductFileList(files);

            // BidsList 저장
            List<BidList> bids = mapper.selectBidsByUserIdAndProductId(product.getUserId(), product.getId());
            product.setProductBidList(bids);
        }


        // 더보기 : 페이지
        int total = mapper.selectTotalCountBidsByUserId(userId);
        Page<Product> page = new PageImpl<>(productList, pageable, total);
        PageInfo pageInfo = new PageInfo().setting(page);
        boolean hasNextPage = pageable.getPageNumber() + 1 < page.getTotalPages();

        return Map.of("productList", productList, "pageInfo", pageInfo, "hasNextPage", hasNextPage);

    }
}
