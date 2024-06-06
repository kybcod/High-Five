USE prj3;

SELECT *
FROM product;
INSERT INTO product
    (title, category, start_price, content, end_time)
VALUES ('123', 'goods', '100', '123', '2024-06-06T19:04');

DESC product;

# user_id NOT NULL로 바꿔야 함
ALTER TABLE product
    MODIFY user_id INT NULL;

ALTER TABLE product_file
    MODIFY file_name VARCHAR(400) NOT NULL;

SELECT *
FROM product_file;

DESC product_file;