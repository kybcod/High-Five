USE prj3;

SELECT *
FROM product;

SELECT *
FROM product_like;

SELECT *
FROM bid_list;

SELECT *
FROM user;

DESC product;

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

SELECT *
FROM user;

SELECT *
FROM product p
         JOIN user u
              ON p.user_id = u.id
WHERE p.user_id = 30
ORDER BY p.end_time
LIMIT 9 OFFSET 0;
