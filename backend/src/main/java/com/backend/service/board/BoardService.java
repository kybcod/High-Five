package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.BoardFile;
import com.backend.domain.user.UserFile;
import com.backend.mapper.board.BoardCommentMapper;
import com.backend.mapper.board.BoardMapper;
import com.backend.util.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper mapper;
    final S3Client s3Client;
    private final BoardCommentMapper boardCommentMapper;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public boolean validate(Board board) {
        if (board.getTitle() == null || board.getTitle().isBlank()) {
            return false;
        }
        if (board.getContent() == null || board.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    public void add(Board board, MultipartFile[] files) throws IOException {
        mapper.insert(board);

        if (files != null) {
            for (MultipartFile file : files) {
                mapper.insertFileName(board.getId(), file.getOriginalFilename());
                String key = STR."prj3/\{board.getId()}/\{file.getOriginalFilename()}";
                System.out.println(key);
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName).key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ).build();
                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }
    }


    public Map<String, Object> list(int page, String type, String keyword) {
        int offset = (page - 1) * 10;
        List<Board> boardList = mapper.selectAll(offset, type, keyword);
        Pageable pageable = PageRequest.of(page - 1, 10);

        int totalBoardNumber = mapper.selectTotalBoardCount(type, keyword);
        Page<Board> pageImpl = new PageImpl<>(boardList, pageable, totalBoardNumber);
        PageInfo pageInfo = new PageInfo().setting(pageImpl);


        Integer lastPageNumber = (totalBoardNumber - 1) / 10 + 1;
        Integer leftPageNumber = (page - 1) / 5 * 5 + 1;
        Integer rightPageNumber = leftPageNumber + 4;
        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        leftPageNumber = rightPageNumber - 4;
        leftPageNumber = Math.max(leftPageNumber, 1);
        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPageNumber = rightPageNumber + 1;

        if (prevPageNumber > 0) {
            pageInfo.setPrevPageNumber(prevPageNumber);
        }
        if (nextPageNumber <= lastPageNumber) {
            pageInfo.setNextPageNumber(nextPageNumber);
        }
        pageInfo.setLastPageNumber(lastPageNumber);
        pageInfo.setLeftPageNumber(leftPageNumber);
        pageInfo.setRightPageNumber(rightPageNumber);

        return Map.of("boardList", boardList, "pageInfo", pageInfo, "totalBoardNumber", totalBoardNumber);

    }

    public Map<String, Object> selectById(Integer id, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        Board board = mapper.selectById(id);

        List<String> fileNames = mapper.selectFileNameByBoardId(board.getId());
        List<BoardFile> files = fileNames.stream()
                .map(fileName -> new BoardFile(fileName, STR."\{srcPrefix}\{board.getId()}/\{fileName}"))
                .toList();

        board.setBoardFileList(files);

        String fileName = mapper.selectFileNameByUserId(board.getUserId());
        UserFile userFile = UserFile.builder()
                .fileName(fileName).src(STR."\{srcPrefix}user/\{board.getUserId()}/\{fileName}").build();
        board.setProfileImage(userFile);

        Map<String, Object> boardLike = new HashMap<>();
        if (authentication == null) {
            boardLike.put("boardLike", false);
        } else {
            int c = mapper.selectLikeByBoardIdAndUserId(id, authentication.getName());
            boardLike.put("boardLike", c == 1);
        }
        boardLike.put("count", mapper.selectCountLikeByBoardId(id));
        result.put("board", board);
        result.put("boardLike", boardLike);

        mapper.viewCountByBoardClick(id);

        return result;

    }

    public void modify(Board board, List<String> removeFileList, MultipartFile[] addFileList) throws IOException {
        if (removeFileList != null && !removeFileList.isEmpty()) {
            for (String fileName : removeFileList) {
                String key = STR."prj3/\{board.getId()}/\{fileName}";
                DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key).build();
                s3Client.deleteObject(objectRequest);
                mapper.deleteFileByBoardIdAndName(board.getId(), fileName);
            }
        }

        if (addFileList != null && addFileList.length > 0) {
            List<String> addFileNameList = mapper.selectFileNameByBoardId(board.getId());
            for (MultipartFile file : addFileList) {
                String fileName = file.getOriginalFilename();
                if (!addFileNameList.contains(fileName)) {
                    mapper.insertFileName(board.getId(), fileName);
                }
                String key = STR."prj3/\{board.getId()}/\{fileName}";
                PutObjectRequest objectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .acl(ObjectCannedACL.PUBLIC_READ).build();
                s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            }
        }

        mapper.update(board);
    }

    public int deleteById(Integer id) {
        boardCommentMapper.deleteCommentByBoardId(id);
        mapper.deleteLikeByBoardId(id);
        mapper.deleteFileByBoardId(id);


        return mapper.deleteById(id);
    }

    public Map<String, Object> like(Map<String, Object> req, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        result.put("boardLike", false);
        Integer boardId = (Integer) req.get("boardId");
        Integer userId = Integer.valueOf(authentication.getName());

        int count = mapper.deleteLikeByBoardIdAndUserId(boardId, userId);

        if (count == 0) {
            mapper.insertLikeByIdAndUserId(boardId, userId);
            result.put("boardLike", true);
        } else {
            result.put("boardLike", false);
        }

        result.put("count", mapper.selectCountLikeByBoardId(boardId));

        return result;
    }

    public Map<String, Object> selectByNextId(Integer id, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        Board nextBoard = mapper.selectByNextId(id);

        List<String> fileNames = mapper.selectFileNameByBoardId(nextBoard.getId());
        List<BoardFile> files = fileNames.stream()
                .map(fileName -> new BoardFile(fileName, STR."\{srcPrefix}\{nextBoard.getId()}/\{fileName}"))
                .toList();

        nextBoard.setBoardFileList(files);

        String fileName = mapper.selectFileNameByUserId(nextBoard.getUserId());
        UserFile userFile = UserFile.builder()
                .fileName(fileName).src(STR."\{srcPrefix}user/\{nextBoard.getUserId()}/\{fileName}").build();
        nextBoard.setProfileImage(userFile);
        System.out.println(userFile.getFileName());

        Map<String, Object> boardLike = new HashMap<>();
        if (authentication == null) {
            boardLike.put("boardLike", false);
        } else {
            int c = mapper.selectLikeByBoardIdAndUserId(id, authentication.getName());
            boardLike.put("boardLike", c == 1);
        }
        boardLike.put("count", mapper.selectCountLikeByBoardId(id));
        result.put("board", nextBoard);
        result.put("boardLike", boardLike);

        mapper.viewCountByBoardClick(nextBoard.getId());

        return result;

    }

    public Map<String, Object> selectByPrevId(Integer id, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        Board prevBoard = mapper.selectByPrevId(id);

        List<String> fileNames = mapper.selectFileNameByBoardId(prevBoard.getId());
        List<BoardFile> files = fileNames.stream()
                .map(fileName -> new BoardFile(fileName, STR."\{srcPrefix}\{prevBoard.getId()}/\{fileName}"))
                .toList();

        prevBoard.setBoardFileList(files);

        String fileName = mapper.selectFileNameByUserId(prevBoard.getUserId());
        UserFile userFile = UserFile.builder()
                .fileName(fileName).src(STR."\{srcPrefix}user/\{prevBoard.getUserId()}/\{fileName}").build();
        prevBoard.setProfileImage(userFile);
        System.out.println(userFile.getFileName());

        Map<String, Object> boardLike = new HashMap<>();
        if (authentication == null) {
            boardLike.put("boardLike", false);
        } else {
            int c = mapper.selectLikeByBoardIdAndUserId(id, authentication.getName());
            boardLike.put("boardLike", c == 1);
        }
        boardLike.put("count", mapper.selectCountLikeByBoardId(id));
        result.put("board", prevBoard);
        result.put("boardLike", boardLike);

        mapper.viewCountByBoardClick(prevBoard.getId());

        return result;
    }
}
