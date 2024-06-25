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

SELECT qb.id, qb.user_id, qb.question_id, qb.content, qb.inserted, user.nick_name
FROM question_board_comment qb
         JOIN user ON qb.user_id = user.id
WHERE question_id = 31;

INSERT INTO authority(user_id, name)
VALUES (59, 'admin');

SELECT qb.id,
       qb.title,
       user.nick_name         as nickName,
       qb.number_of_count,
       qb.inserted,
       COUNT(qbf.question_id) as numberOfFiles,
       COUNT(qbc.question_id) as numberOfComments
FROM question_board qb
         JOIN user ON qb.user_id = user.id
         LEFT JOIN question_board_file qbf ON qb.id = qbf.question_id
         LEFT JOIN question_board_comment qbc ON qb.id = qbc.question_id
WHERE qb.id = 28;

SELECT qb.id,
       qb.title,
       user.nick_name AS nickName,
       qb.number_of_count,
       qb.inserted,
       qbf.numberOfFiles,
       qbc.numberOfComments
FROM question_board qb
         JOIN user ON qb.user_id = user.id
         LEFT JOIN (SELECT question_id, COUNT(*) AS numberOfFiles
                    FROM question_board_file
                    GROUP BY question_id) qbf ON qb.id = qbf.question_id
         LEFT JOIN (SELECT question_id, COUNT(*) AS numberOfComments
                    FROM question_board_comment
                    GROUP BY question_id) qbc ON qb.id = qbc.question_id
WHERE qb.id = 28;

UPDATE question_board_comment
SET content='잘 안되시면 다시 글 남겨주세요',
    inserted=now()
WHERE id = 47;

ALTER TABLE question_board
    ADD COLUMN secretWrite INT DEFAULT 0 NOT NULL;

ALTER TABLE question_board
    CHANGE COLUMN secretWrite secret_write BOOLEAN DEFAULT FALSE NOT NULL;


ALTER TABLE question_board
    MODIFY COLUMN secretWrite BOOLEAN DEFAULT false NOT NULL;

desc question_board;

CREATE TABLE FAQ
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(10)   NOT NULL,
    title    VARCHAR(200)  NOT NULL,
    content  VARCHAR(2000) NOT NULL
)