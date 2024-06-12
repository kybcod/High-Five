SELECT *
FROM board;

ALTER TABLE board
    MODIFY user_id INT NOT NULL;

# 내 로그인 아이디 확인 18
SELECT *
FROM user;

DROP TABLE board;

# 임의로 값 넣어 테이블 확인
INSERT INTO board (id, user_id, title, content, inserted)
    VALUE (11, 18, 'aaa', 'aaa', '2024.06.12T10:36:11');
