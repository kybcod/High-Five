SELECT *
FROM board
ORDER BY id DESC;


SELECT *
FROM board_like;


SELECT *
FROM board_file;


# 코드 작성 초기 로그인 기능 구현 이전에 임시로 NULL 처리
ALTER TABLE board
    MODIFY user_id INT NULL;

# 컬럼 조건을 변경하기 위해 게시글 모두 삭제
DELETE
FROM board
WHERE user_id = 'NULL';

# 로그인 기능 구현 이후 NULL 삭제
ALTER TABLE board
    MODIFY user_id INT NOT NULL;


SELECT *
FROM board_comment;

# board_comment 대댓글 기능 컬럼 추가
# ALTER TABLE board_comment ADD reference_id INT NOT NULL DEFAULT
ALTER TABLE board_comment
    ADD comment_sequence INT NOT NULL DEFAULT 0;

ALTER TABLE board_comment
    ADD reference_id INT NOT NULL DEFAULT 0;

# 조회수 기능 컬럼 추가
ALTER TABLE board
    ADD COLUMN view_count INT DEFAULT 0;