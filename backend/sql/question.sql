SELECT qb.id, qb.title, user.nick_name as nickName, qb.inserted
FROM question_board qb
         JOIN user
              ON qb.user_id = user.id;

SELECT qb.id, qb.title, qb.content, qb.inserted, user.nick_name nickName
FROM question_board qb
         JOIN user ON qb.user_id = user.id
WHERE qb.id = 1;

SELECT file_name
FROM question_board_file
WHERE question_id = 2;

use prj3;

desc question_board;
desc question_board_file;
desc question_board_comment;

ALTER TABLE question_board_file
    MODIFY COLUMN file_name varchar(200) NOT NULL;

SELECT *
FROM question_board_comment
WHERE question_id = 31;

SELECT user_id
FROM question_board_comment
WHERE question_id = 31;

SELECT COUNT(user_id)
FROM question_board_comment
WHERE question_id = 31;

INSERT INTO authority (user_id, name)
VALUES (58, 'user');

ALTER TABLE question_board
    ADD COLUMN number_of_count INT DEFAULT 0 NOT NULL;