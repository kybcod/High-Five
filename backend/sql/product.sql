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
WHERE user_id = 20;

SELECT *

FROM chat;

SELECT *
FROM chat_room;

alter table product_file
    modify id INT first;

alter table product_file
    auto_increment = 1;

alter table product_file
    add constraint product_file_pk
        primary key (id);

alter table product_file
    modify id INT auto_increment;