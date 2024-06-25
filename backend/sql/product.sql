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
FROM chat;

SELECT *
FROM chat_room;

# 판매 종료 0
SELECT *
FROM payment;

SELECT *
FROM bid_list;

SELECT *
FROM payment;