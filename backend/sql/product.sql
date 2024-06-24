USE prj3;

# Too many connections
SHOW STATUS LIKE 'threads_connected'; # 148
SHOW VARIABLES LIKE 'max_connections'; # 300
SHOW VARIABLES LIKE 'wait_timeout'; #28800
SET GLOBAL MAX_CONNECTIONS = 300;


SELECT *
FROM product_like;

SELECT *
FROM bid_list;

SELECT *
FROM bid_list
WHERE product_id = 100;

SELECT *
FROM product;

SELECT *
FROM user;

SELECT *
FROM chat;

SELECT *
FROM chat_room;

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
       p.review_status,
       u.nick_name AS userNickName
FROM product p
         JOIN user u ON p.user_id = u.id
         JOIN bid_list b ON b.user_id = u.id
WHERE p.user_id = 10
ORDER BY p.end_time;

# 낙찰자의 id를 가져와야 함
SELECT u.nick_name AS successBidNickName, bl.user_id AS successBidUserId
FROM bid_list bl
         JOIN user u on u.id = bl.user_id
WHERE product_id = 100
  AND bid_status = TRUE;

SELECT *
FROM product
WHERE id = 100;