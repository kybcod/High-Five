package com.backend.controller.board;

import com.backend.domain.board.Board;
import com.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public List<Board> list() {
        return service.list();
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

    @PutMapping("like")
    public Map<String, Object> like(@RequestBody Map<String, Object> req, Authentication authentication) {
        return service.like(req, authentication);
    }

    @GetMapping("/like/{id}")
    public ResponseEntity<Map<String, Object>> like(@PathVariable Integer id, Authentication authentication) {
        Map<String, Object> result = service.selectById(id, authentication);
        return ResponseEntity.ok().body(result);
    }
}
