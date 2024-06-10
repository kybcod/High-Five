package com.backend.controller.Question;

import com.backend.domain.Question.Question;
import com.backend.service.Question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/question")
public class QuestionController {
    private final QuestionService service;

    @PostMapping("")
    public ResponseEntity add(Question question, @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(question)) {
            service.add(question, files);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("list")
    public List<Question> list(@RequestParam(defaultValue = "1") Integer page) {
        return service.list();
    }

    @GetMapping("{id}")
    public Question getQuestion(@PathVariable Integer id) {
        return service.get(id);
    }
}
