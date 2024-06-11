SELECT *
FROM board;

ALTER TABLE board
    MODIFY user_id INT NULL;

DELETE
FROM board
WHERE id = 1;