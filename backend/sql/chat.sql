USE prj3;

SELECT *
FROM chat;

SELECT *
FROM chat_room;

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

SELECT *
FROM chat
WHERE chat_room_id IN (SELECT id
                       FROM chat_room
                       WHERE user_id = 34
                          OR seller_id = 34)
ORDER BY inserted DESC;

ALTER TABLE chat_room
    ADD user_exit BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE chat_room
    ADD seller_exit BOOLEAN NOT NULL DEFAULT FALSE;