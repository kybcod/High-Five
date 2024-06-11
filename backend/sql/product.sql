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

SELECT *
FROM bid_list
WHERE product_id;



DESC product;

