USE prj3;

SELECT *
FROM product;

# user_id NOT NULL로 바꿔야 함
ALTER TABLE product
    MODIFY user_id INT NULL;

SELECT *
FROM product_like;

SELECT *
FROM bid_list;

SELECT *
FROM product;

SELECT p.id,
       p.title,
       p.category,
       p.start_price,
       p.start_time,
       p.end_time,
       p.content,
       COUNT(bl.user_id)
FROM product p
         JOIN bid_list bl
              ON p.id = bl.product_id
GROUP BY product_id;

SELECT *
FROM bid_list
WHERE product_id;



DESC product;

