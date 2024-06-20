package com.backend.controller.question;

import com.backend.domain.question.Question;
import com.backend.service.question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity add(Question question,
                              @RequestParam(value = "files[]", required = false) MultipartFile[] files,
                              Authentication authentication
    ) throws IOException {
        // todo : 로그인 안한 사람이 글을 썼을 때 응답번호 403반환되게. 로그인 안한 사람이 글을 쓰면 로그인에서 304반환되고 있음
        if (service.validate(question)) {
            service.add(question, files, authentication);
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(@PathVariable Integer id, Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            service.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PutMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity update(@PathVariable Integer id, Question question, Authentication authentication,
                                 @RequestParam(required = false, value = "addFileList[]") MultipartFile[] addFileList,
                                 @RequestParam(required = false, value = "removeFileList[]") List<String> removeFileList
    ) throws IOException {
        if (!service.hasAccess(id, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (service.validate(question)) {
            service.edit(question, addFileList, removeFileList);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

}
