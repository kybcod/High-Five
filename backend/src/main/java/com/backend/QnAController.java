package com.backend;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question")
public class QnAController {
    private final QnaService service;

    @PostMapping("")
    public void add(@RequestBody Qna qna){
        service.add(qna);
    }
}
