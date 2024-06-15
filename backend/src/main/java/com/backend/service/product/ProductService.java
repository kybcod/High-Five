package com.backend.service.product;

import com.backend.domain.product.BidList;
import com.backend.domain.product.Product;
import com.backend.domain.product.ProductFile;
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
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper mapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void upload(Product product, MultipartFile[] files, Authentication authentication) throws IOException {
        Integer userId = Integer.valueOf(authentication.getName());
        product.setUserId(userId);

        mapper.insert(product);

        //파일 추가
        if (files != null) {
            for (MultipartFile file : files) {
                // DB 저장
                mapper.insertFile(product.getId(), file.getOriginalFilename());

                //실제 파일 저장
                String key = STR."prj3/\{product.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(putObjectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }


    public List<Product> list() {
        List<Product> products = mapper.selectAll();

        // 각 product에 모든 파일을 설정
        for (Product product : products) {
            List<String> productFiles = mapper.selectFileByProductId(product.getId());
            List<ProductFile> files = productFiles.stream()
                    .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                    .toList();
            product.setProductFileList(files);
        }
        return products;
    }

    public Map<String, Object> getList(Pageable pageable, String keyword, String category) {
        List<Product> content = mapper.selectWithPageable(pageable, keyword, category);

        // 각 product에 모든 파일을 설정
        for (Product product : content) {
            List<String> productFiles = mapper.selectFileByProductId(product.getId());
            List<ProductFile> files = productFiles.stream()
                    .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                    .toList();
            product.setProductFileList(files);
        }

        int total = mapper.selectTotalCount(keyword, category);
        Page<Product> page = new PageImpl<>(content, pageable, total);
        PageInfo pageInfo = new PageInfo().setting(page);
        return Map.of("content", content, "pageInfo", pageInfo);
    }

    public Map<String, Object> get(Integer id, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        mapper.updateViewCount(id);

        Product product = mapper.selectById(id);

        List<String> productFiles = mapper.selectFileByProductId(product.getId());
        List<ProductFile> files = productFiles.stream()
                .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                .toList();
        product.setProductFileList(files);

        //좋아요
        Map<String, Object> like = new HashMap<>();
        if (authentication == null) {
            like.put("like", false);
        } else {
            int i = mapper.selectLikeByProductIdAndUserId(id, authentication.getName());
            like.put("like", i == 1);
        }
        like.put("count", mapper.selectCountLikeByProductId(id));

        result.put("product", product);
        result.put("like", like);
        result.put("productFileList", product.getProductFileList());
        return result;
    }

    public void edit(Product product, List<String> removedFileList, MultipartFile[] newFileList) throws IOException {
        if (removedFileList != null && removedFileList.size() > 0) {
            //s3 파일 삭제
            for (String name : removedFileList) {
                String key = STR."prj3/\{product.getId()}/\{name}";
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteObjectRequest);

                mapper.deleteFileByProductIdAndFileName(product.getId(), name);
            }
        }

        if (newFileList != null && newFileList.length > 0) {
            List<String> fileNameList = mapper.selectFileByProductId(product.getId());

            for (MultipartFile file : newFileList) {
                String name = file.getOriginalFilename();
                if (!fileNameList.contains(name)) {
                    mapper.insertFile(product.getId(), name);
                }

                //실제 파일 저장
                String key = STR."prj3/\{product.getId()}/\{name}";
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(putObjectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
        mapper.update(product);
    }

    public void remove(Integer id) {

        // s3에서 파일(이미지) 삭제
        List<String> fileNameList = mapper.selectFileByProductId(id);
        for (String fileName : fileNameList) {
            String key = STR."prj3/\{id}/\{fileName}";
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        }

        mapper.deleteLikeByBoardId(id);
        mapper.deleteFileByProductId(id);
        mapper.deleteByProductId(id);
    }

    public Map<String, Object> like(Map<String, Object> likeInfo, Authentication authentication) {

        Map<String, Object> result = new HashMap<>();
        result.put("like", false);

        Integer productId = (Integer) likeInfo.get("productId");
        Integer userId = Integer.valueOf(authentication.getName());

        // 이미 좋아요가 되어 있다면 delete(count=1)
        int count = mapper.deleteLikeByBoardIdAndUserId(productId, userId);

        // 좋아요 안했으면 insert
        if (count == 0) {
            mapper.insertLikeByBoardIdAndUserId(productId, userId);
            result.put("like", true);
        }
        result.put("count", mapper.selectCountLikeByProductId(productId));

        return result;
    }

    public List<Integer> getLike(Integer userId) {
        return mapper.selectLikeByUserId(userId);
    }

    public void upsertBidPrice(BidList bid) {
        if (mapper.existsBid(bid.getProductId(), bid.getUserId())) {
            mapper.updateBidPrice(bid);
        } else {
            mapper.insertBidPrice(bid);
        }
    }


    public boolean validate(Product product) {
        if (product.getTitle() == null || product.getTitle().isBlank()) {
            return false;
        }
        if (product.getCategory() == null || product.getCategory().isBlank()) {
            return false;
        }
        if (product.getStartPrice() == null || product.getStartPrice().isBlank()) {
            return false;
        }
        if (product.getEndTime() == null) {
            return false;
        }
        return true;
    }

    //userId 받고 있는지 확인하기 위해 즉 로그인 했는지
    public boolean hasAccess(Integer id, Authentication authentication) {

        Product product = mapper.selectById(id);
        return product.getUserId().equals(Integer.valueOf(authentication.getName()));
    }

    // TODO : Mapper 정리
    public void updateProductState() {
        //현재 시간과 상품의 endTime을 비교해서
        // 만약에 같다면 판매 상태(TRUE)로 바꾸고
        // bid_list에서 status 상태(False)로 바꾸어야 합니다.

//        (상품 및 입찰 내역 관한 정보 가져오기)
        LocalDateTime currentTime = LocalDateTime.now();
        List<Product> productList = mapper.selectProductAndBidList();

        for (Product product : productList) {
            if (product.getEndTime().isBefore(currentTime) && product.getStatus()) {
                product.setStatus(false);
                mapper.updateStatus(product);
                mapper.updateBidStatusByProductId(product.getId(), true);
            }
            System.out.println(STR."\{product.getTitle()} : 끝나는 시간(\{product.getEndTime()}) , 상품 상태 : \{product.getStatus()}");

        }
    }

    public Map<String, Object> getProductsByUserId(Integer userId, Pageable pageable) {
        List<Product> productList = mapper.selectProductsByUserIdWithPagination(userId, pageable);

        for (Product product : productList) {
            List<String> productFiles = mapper.selectFileByProductId(product.getId());
            List<ProductFile> files = productFiles.stream()
                    .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                    .toList();
            product.setProductFileList(files);
        }

        // 더보기 : 페이지
        int total = mapper.selectTotalCountByUserId(userId);
        Page<Product> page = new PageImpl<>(productList, pageable, total);
        PageInfo pageInfo = new PageInfo().setting(page);
        boolean hasNextPage = pageable.getPageNumber() + 1 < page.getTotalPages();

        // 좋아요
        List<Product> like = mapper.selectLikeSelectByUserId(userId);


        return Map.of("productList", productList, "like", like, "pageInfo", pageInfo, "hasNextPage", hasNextPage);

    }

    public List<Product> getProductsLikeByUserId(Integer userId) {
        // 좋아요
        List<Product> likeProductList = mapper.selectLikeSelectByUserId(userId);

        for (Product product : likeProductList) {
            List<String> productFiles = mapper.selectFileByProductId(product.getId());
            List<ProductFile> files = productFiles.stream()
                    .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                    .toList();
            product.setProductFileList(files);
        }

        return likeProductList;
    }

}



