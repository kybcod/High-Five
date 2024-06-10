package com.backend.service.Question;

import com.backend.domain.Question.Question;
import com.backend.mapper.Question.QuestionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionMapper mapper;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void add(Question question, MultipartFile[] files) throws IOException {
        mapper.insert(question);

        if (files != null) {
            for (MultipartFile file : files) {
                mapper.insertFileName(question.getId(), file.getOriginalFilename());

                String key = STR."prj3/\{question.getId()}/\{file.getOriginalFilename()}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(objectRequest,
                        RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }

    public boolean validate(Question question) {
        if (question.getTitle() == null || question.getTitle().isBlank()) {
            return false;
        }
        if (question.getContent() == null || question.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    public List<Question> list() {
        return mapper.getList();
    }

    public Question get(Integer id) {
        return mapper.selectById(id);
    }
}
