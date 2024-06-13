package com.backend.service.Question;

import com.backend.domain.Question.Question;
import com.backend.domain.Question.QuestionFile;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

//    public Map<String, Object> list(Pageable pageable, String searchType, String keyword) {
//        int total = mapper.countAllWithSearch(searchType, keyword);
//        List<Question> content = mapper.selectUsingPageable(pageable, searchType, keyword);
//        Page<Question> page = new PageImpl<>(content, pageable, total);
//        PageInfo pageInfo = new PageInfo().setting(page);
//        return Map.of("content", content, "pageInfo", pageInfo);
//    }

    public Map<String, Object> list(Integer page, String searchType, String keyword) {
        Map pageInfo = new HashMap();
        Integer countAll = mapper.countAllWithSearch(searchType, keyword);

        Integer offset = (page - 1) * 5;
        Integer lastPageNumber = (countAll - 1) / 5 + 1;
        Integer leftPageNumber = (page - 1) / 3 * 3 + 1;
        Integer rightPageNumber = leftPageNumber + 2;
        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        leftPageNumber = rightPageNumber - 2;
        leftPageNumber = Math.max(leftPageNumber, 1);
        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPageNumber = rightPageNumber + 1;

        //  이전,처음,다음,맨끝 버튼 만들기
        if (prevPageNumber > 0) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPageNumber <= lastPageNumber) {
            pageInfo.put("nextPageNumber", nextPageNumber);
        }
        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);

        return Map.of("pageInfo", pageInfo,
                "content", mapper.selectUsingPageable(offset, searchType, keyword));
    }

    public Question get(Integer id) {
        Question question = mapper.selectById(id);
        List<String> filesNames = mapper.selectFileByQuestionId(id);
        List<QuestionFile> files = filesNames.stream()
                .map(name -> new QuestionFile(name, STR."\{srcPrefix}\{question.getId()}/\{name}"))
                .toList();
        question.setFileList(files);
        return question;
    }

    public void delete(Integer id) {
        mapper.deleteByIdFile(id);
        mapper.deleteById(id);
    }

    public void edit(Question question) {
        mapper.updateById(question);
    }
}
