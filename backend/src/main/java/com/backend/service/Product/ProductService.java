package com.backend.service.Product;

import com.backend.domain.Product.Product;
import com.backend.domain.Product.ProductFile;
import com.backend.mapper.Product.ProductMapper;
import com.backend.util.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
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

    public void upload(Product product, MultipartFile[] files) throws IOException {
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


    public List<Product> list(Integer id) {
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

    public Map<String, Object> getList(Pageable pageable, String keyword) {
        List<Product> content = mapper.selectWithPageable(pageable, keyword);

        // 각 product에 모든 파일을 설정
        for (Product product : content) {
            List<String> productFiles = mapper.selectFileByProductId(product.getId());
            List<ProductFile> files = productFiles.stream()
                    .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                    .toList();
            product.setProductFileList(files);
        }

        int total = mapper.selectTotalCount();
        Page<Product> page = new PageImpl<>(content, pageable, total);
        PageInfo pageInfo = new PageInfo().setting(page);
        return Map.of("content", content, "pageInfo", pageInfo);
    }

    public Product get(Integer id) {
        Product product = mapper.selectById(id);
        List<String> productFiles = mapper.selectFileByProductId(product.getId());
        List<ProductFile> files = productFiles.stream()
                .map(fileName -> new ProductFile(fileName, STR."\{srcPrefix}\{product.getId()}/\{fileName}"))
                .toList();
        product.setProductFileList(files);
        return product;
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

        mapper.deleteFileByProductId(id);

        mapper.deleteByProductId(id);
    }

    public boolean validate(Product product) {
        if (product.getTitle() == null || product.getTitle().isBlank()) {
            return false;
        }
        if (product.getContent() == null || product.getContent().isBlank()) {
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
}
