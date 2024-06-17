package com.backend.controller.question;

import com.backend.domain.question.Question;
import com.backend.service.question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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
    public Map<String, Object> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(value = "type", required = false) String searchType,
            @RequestParam(value = "keyword", defaultValue = "") String keyword) {
//        return service.list(PageRequest.of(page - 1, 5), searchType, keyword);
        return service.list(page, searchType, keyword);
    }

    @GetMapping("{id}")
    public ResponseEntity getQuestion(@PathVariable Integer id) {
        Question question = service.get(id);
        if (question != null) {
            return ResponseEntity.ok().body(question);
        } else
            return ResponseEntity.notFound().build();
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @PutMapping("{id}")
    public ResponseEntity update(Question question,
                                 @RequestParam(required = false, value = "addFileList[]") MultipartFile[] addFileList,
                                 @RequestParam(required = false, value = "removeFileList[]") List<String> removeFileList
    ) throws IOException {
        if (service.validate(question)) {
            service.edit(question, addFileList, removeFileList);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

}
