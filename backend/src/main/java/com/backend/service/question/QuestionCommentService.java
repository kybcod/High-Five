package com.backend.service.question;

import com.backend.domain.question.QuestionComment;
import com.backend.mapper.question.QuestionCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class QuestionCommentService {
    private final QuestionCommentMapper mapper;

    public void addComment(QuestionComment comment, Authentication authentication) {
        comment.setUserId(Integer.valueOf(authentication.getName()));
        mapper.insertComment(comment);
    }

    public List<QuestionComment> get(Integer questionId) {
        return mapper.getComment(questionId);
    }

    public void delete(Integer questionId) {
        mapper.deleteComment(questionId);
    }

    public boolean hasAccess(Integer questionId, Authentication authentication) {
        QuestionComment comment = mapper.selectUserId(questionId);
        if (comment.getUserId().equals(Integer.valueOf(authentication.getName()))) {
            return true;
        }
        return false;
    }
}
