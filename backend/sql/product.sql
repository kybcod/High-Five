USE prj3;

SELECT *
FROM product;

# user_id NOT NULL로 바꿔야 함
ALTER TABLE product
    MODIFY user_id INT NULL;

SELECT *
FROM product_like;

DESC product;

ALTER TABLE product
    ADD COLUMN product_like BOOLEAN NOT NULL DEFAULT false;

SELECT *
From product_like
WHERE user_id = 10;
SELECT product_id
FROM product_like
WHERE product_id in (5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27)
  AND user_id = 10;

SELECT COUNT(*)
FROM product_like
WHERE product_id = 10
  AND user_id = 10;


SELECT p.id,
       p.title,
       p.category,
       p.start_price,
       p.start_time,
       p.end_time,
       p.content,
       COUNT(pl.product_id) AS like_count
FROM product p
         LEFT JOIN product_like pl ON p.id = pl.product_id
WHERE pl.user_id = 10
ORDER BY p.end_time;
