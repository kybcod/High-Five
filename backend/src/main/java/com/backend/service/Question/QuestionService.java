package com.backend.service.Question;

import com.backend.domain.Question.Question;
import com.backend.mapper.Question.QuestionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionMapper mapper;

    public void add(Question question) {
        mapper.insert(question);
    }


}
