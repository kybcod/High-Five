package com.backend.service.question;

import com.backend.domain.question.QuestionComment;
import com.backend.mapper.question.QuestionCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class QuestionCommentService {
    private final QuestionCommentMapper mapper;

    public void addComment(QuestionComment comment) {
        mapper.insertComment(comment);
    }
}
