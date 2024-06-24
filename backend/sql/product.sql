USE prj3;

# Too many connections
SHOW STATUS LIKE 'threads_connected'; # 148
SHOW VARIABLES LIKE 'max_connections'; # 300
SHOW VARIABLES LIKE 'wait_timeout'; #28800
SET GLOBAL MAX_CONNECTIONS = 300;


SELECT *
FROM product_like;

SELECT user_id, COUNT(user_id)
FROM bid_list
GROUP BY user_id;

SELECT *
FROM product;

SELECT *
FROM user;

SELECT *
FROM chat;

SELECT *
FROM chat_room;