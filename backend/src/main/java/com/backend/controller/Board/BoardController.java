package com.backend.controller.Board;

import com.backend.domain.Board.Board;
import com.backend.service.Board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService service;

    @PostMapping("add")
    public ResponseEntity add(Board board, @RequestBody MultipartFile[] files) throws IOException {
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
    public Board view(@PathVariable Integer id) {
        return service.selectById(id);
    }


    @PutMapping("modify")
    public ResponseEntity update(@RequestBody Board board) {
        if (service.validate(board)) {
            service.modify(board);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("{id}")
    public int delete(@PathVariable Integer id) {
        return service.deleteById(id);
    }
}
