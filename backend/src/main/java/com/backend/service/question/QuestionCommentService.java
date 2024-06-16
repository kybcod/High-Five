package com.backend.service.question;

import com.backend.domain.question.QuestionComment;
import com.backend.mapper.question.QuestionCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class QuestionCommentService {
    private final QuestionCommentMapper mapper;

    public void addComment(QuestionComment comment, Authentication authentication) {
        comment.setUserId(Integer.valueOf(authentication.getName()));
        mapper.insertComment(comment);
    }
}
