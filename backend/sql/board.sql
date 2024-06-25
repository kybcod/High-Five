SELECT *
FROM board;

SELECT *
FROM board_like;

ALTER TABLE board
    MODIFY user_id INT NOT NULL;

# 내 로그인 아이디 확인 18
SELECT *
FROM user;

DROP TABLE board_file;

SELECT *
FROM board_file;

# 임의로 값 넣어 테이블 확인
INSERT INTO board (id, user_id, title, content, inserted)
    VALUE (11, 18, 'aaa', 'aaa', '2024.06.12T10:36:11');

SELECT *
FROM user;

INSERT INTO authority (user_id, name)
    VALUE (36, 'user');

# insert into board temporary
INSERT INTO board (title, content, user_id, inserted)
SELECT title, content, user_id, inserted
FROM board;

SELECT board_id, user_id, content, inserted
FROM board_comment
WHERE board_id = '88';

# board_comment 대댓글 기능
# ALTER TABLE board_comment ADD reference_id INT NOT NULL DEFAULT
ALTER TABLE board_comment
    ADD comment_sequence INT NOT NULL DEFAULT 0;

ALTER TABLE board_comment
    ADD reference_id INT NOT NULL DEFAULT 0;

SELECT *
FROM board_comment;

SELECT *
FROM board_comment
WHERE comment_id = 1;

DELETE
FROM board_comment
WHERE board_id = 65;