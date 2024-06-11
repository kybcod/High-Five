package com.backend.service.Board;

import com.backend.domain.Board.Board;
import com.backend.mapper.Board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper mapper;

    public boolean validate(Board board) {
        if (board.getTitle() == null || board.getTitle().isBlank()) {
            return false;
        }
        if (board.getContent() == null || board.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    public int add(Board board) {
        return mapper.insert(board);
    }

    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board selectById(Integer id) {
        return mapper.selectById(id);
    }

    public void modify(Board board) {
        mapper.update(board);
    }
}
