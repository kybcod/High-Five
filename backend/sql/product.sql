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


SELECT *
FROM bid_list;

SELECT *
FROM user;

SELECT p.id,
       p.title,
       p.category,
       p.start_price,
       p.start_time,
       p.end_time,
       p.content,
       p.status,
       p.user_id
FROM product p
         JOIN product_like pl ON p.id = pl.product_id
WHERE pl.user_id = 10;
