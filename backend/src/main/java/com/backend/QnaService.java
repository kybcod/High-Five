package com.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class QnaService {
    private final QnaMapper mapper;

    public void add(Qna qna) {
        mapper.insert(qna);
    }


}
