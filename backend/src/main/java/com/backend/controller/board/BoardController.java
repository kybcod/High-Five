package com.backend.controller.board;

import com.backend.domain.board.Board;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService service;

    @PostMapping("add")
    public ResponseEntity add(Board board, @RequestParam(value = "files[]", required = false) MultipartFile[] files) throws IOException {
        if (service.validate(board)) {
            service.add(board, files);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1", required = false) int page, @RequestParam(defaultValue = "", required = false) String type, @RequestParam(defaultValue = "", required = false) String keyword, @RequestParam(defaultValue = "", required = false) String sort, @RequestParam(defaultValue = "", required = false) String order) {
        return service.list(page, type, keyword);
    }

    @GetMapping("{id}")
    public ResponseEntity view(@PathVariable Integer id, Authentication authentication) {
        Map<String, Object> result = service.selectById(id, authentication);

        return ResponseEntity.ok().body(result);
    }

    @PutMapping("modify")
    public ResponseEntity update(Board board,
                                 @RequestParam(value = "removeFileList[]", required = false) List<String> removeFileList,
                                 @RequestParam(value = "addFileList[]", required = false) MultipartFile[] addFileList) throws IOException {
        if (service.validate(board)) {
            service.modify(board, removeFileList, addFileList);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable Integer id) {
        return service.deleteById(id);
    }

    @PutMapping("like/{id}")
    public ResponseEntity<Map<String, Object>> like(@PathVariable Integer id, @RequestBody Map<String, Object> req, Authentication authentication) {
        Map<String, Object> likeResult = service.like(req, authentication);
        Map<String, Object> viewResult = service.selectById(id, authentication);

        Map<String, Object> combinedResult = new HashMap<>();
        combinedResult.putAll(likeResult);
        combinedResult.putAll(viewResult);

        return ResponseEntity.ok().body(combinedResult);
    }

}
