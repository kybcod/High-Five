USE prj3;

# Too many connections
SHOW STATUS LIKE 'threads_connected'; # 148
SHOW VARIABLES LIKE 'max_connections'; # 300
SHOW VARIABLES LIKE 'wait_timeout'; #28800
SET GLOBAL MAX_CONNECTIONS = 300;


SELECT *
FROM product_like;

SELECT *
FROM product;

SELECT *
FROM user;

SELECT *
FROM bid_list
WHERE product_id = 105;

SELECT *
FROM chat;

SELECT *
FROM chat_room;

# 판매 종료 0
SELECT *
FROM payment;

SELECT *
FROM bid_list;

SELECT COUNT(status) AS totalSalesCount
FROM product
WHERE user_id = 10
  AND status = FALSE;

SELECT COUNT(*) AS totalProductCount
FROM product
WHERE user_id = 10;

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
         JOIN user u
              ON p.user_id = u.id
WHERE p.user_id = 10
ORDER BY p.start_time DESC;