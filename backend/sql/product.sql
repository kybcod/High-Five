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

DESC product;

SELECT *
from user;