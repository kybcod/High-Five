USE prj3;

# Too many connections
SHOW STATUS LIKE 'threads_connected'; # 148
SHOW VARIABLES LIKE 'max_connections'; # 300
SHOW VARIABLES LIKE 'wait_timeout'; #28800
SET GLOBAL MAX_CONNECTIONS = 300;

SELECT *
FROM product_like;

DESC product_like;
SHOW CREATE TABLE product_like;

# 외래키 제약 조건 삭제
ALTER TABLE product_like
    DROP FOREIGN KEY `product_like_ibfk_1`;
ALTER TABLE product_like
    DROP FOREIGN KEY `product_like_ibfk_2`;


# 기본키 제약 조건 삭제
ALTER TABLE product_like
    DROP PRIMARY KEY;

# id 기본키
ALTER TABLE product_like
    ADD COLUMN id INT PRIMARY KEY AUTO_INCREMENT FIRST;

# 외래키 다시 제약 조건
ALTER TABLE product_like
    ADD CONSTRAINT `product_like_ibfk_1` FOREIGN KEY (product_id) REFERENCES product (id);
ALTER TABLE product_like
    ADD CONSTRAINT `product_like_ibfk_2` FOREIGN KEY (user_id) REFERENCES user (id);

SELECT *
FROM product;

SELECT *
FROM user;

SELECT *
FROM chat;

SELECT *
FROM chat_room;

SELECT *
FROM payment;

SELECT *
FROM bid_list;

SELECT *
FROM payment;