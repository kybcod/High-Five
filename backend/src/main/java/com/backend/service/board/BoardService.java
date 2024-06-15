package com.backend.service.board;

import com.backend.domain.board.Board;
import com.backend.domain.board.BoardFile;
import com.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper mapper;
    final S3Client s3Client;

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


    public List<Board> list() {
        return mapper.selectAll();
    }

    public Board selectById(Integer id) {
        Board board = mapper.selectById(id);
        List<String> fileNames = mapper.selectFileNameByBoardId(board.getId());
        List<BoardFile> files = fileNames.stream()
                .map(fileName -> new BoardFile(fileName, STR."\{srcPrefix}\{board.getId()}/\{fileName}"))
                .toList();

        board.setBoardFileList(files);

        return board;

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
        return mapper.deleteById(id);
    }
}
