USE prj3;

SELECT *
FROM product_like;

SELECT *
FROM bid_list;

SELECT *
FROM user;

SELECT *
FROM product
WHERE id = 55;

UPDATE product
SET status = TRUE
WHERE status = FALSE;


SELECT p.id,
       p.title,
       p.category,
       p.start_price,
       p.status,
       p.content,
       p.start_time,
       p.end_time,
       bl.status
FROM product p
         LEFT JOIN bid_list bl
                   ON p.id = bl.product_id
ORDER BY p.end_time;


SELECT MAX(bid_price)
FROM bid_list
WHERE product_id = 28;

SELECT p.id,
       p.user_id,
       p.title,
       p.category,
       p.start_price,
       p.start_time,
       p.end_time,
       p.content,
       p.view_count,
       p.status,
       COUNT(DISTINCT bl.user_id) AS numberOfJoin,
       u.nick_name                AS userNickName,
       MAX(bl.bid_price)          AS maxBidPrice
FROM product p
         LEFT JOIN bid_list bl
                   ON p.id = bl.product_id
         JOIN user u ON u.id = p.user_id
WHERE p.id = 28;



SHOW STATUS LIKE 'threads_connected'; # 148
SHOW VARIABLES LIKE 'max_connections'; # 151
SHOW VARIABLES LIKE 'wait_timeout'; #28800

SET GLOBAL MAX_CONNECTIONS = 300;


DESC chat_room;
