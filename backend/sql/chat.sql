USE prj3;

SELECT *
FROM chat;

SELECT *
FROM chat_room;

# test1 userId : 21, test2 userId : 27

# k 10
SELECT *
FROM chat
WHERE user_id = 10;

SELECT f.*
FROM chat f
         INNER JOIN (SELECT chat_room_id, MAX(inserted) AS latest_inserted
                     FROM chat
                     GROUP BY chat_room_id) AS second
                    ON f.chat_room_id = second.chat_room_id AND f.inserted = second.latest_inserted;
SELECT *
FROM chat c
         LEFT JOIN chat_room cr ON c.chat_room_id = cr.id;

SELECT m.*
FROM chat m
         INNER JOIN (SELECT chat_room_id, MAX(inserted) AS latest_inserted
                     FROM chat
                     GROUP BY chat_room_id) AS latest
                    ON m.chat_room_id = latest.chat_room_id AND m.inserted = latest.latest_inserted;


SELECT *
FROM chat_room;

SELECT *
FROM chat;

# 읽음 여부 컬럼 생성
ALTER TABLE chat
    ADD read_check BOOLEAN NOT NULL DEFAULT FALSE;

# 이전 데이터 읽음으로 변경
UPDATE chat
SET read_check = TRUE
WHERE read_check = FALSE;

UPDATE chat
SET read_check = FALSE
WHERE id = 69;

SELECT *
FROM chat
WHERE chat_room_id IN (SELECT id
                       FROM chat_room
                       WHERE user_id = 34
                          OR seller_id = 34)
ORDER BY inserted DESC;

# chatRoom 최신순으로 조회
SELECT id
FROM chat_room
WHERE user_id = 34
   OR seller_id = 34;


