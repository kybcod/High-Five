USE prj3;

SELECT *
FROM product;

SELECT *
FROM product_like;

SELECT *
FROM bid_list;

DESC product;

SELECT COUNT(*) > 0
FROM bid_list
WHERE product_id = 8
  AND user_id = 10;
