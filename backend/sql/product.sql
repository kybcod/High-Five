USE prj3;

SELECT *
FROM product;

SELECT p.id,
       p.title,
       p.category,
       p.start_price,
       p.start_time,
       p.end_time,
       p.content,
       pf.file_name
FROM product p
         LEFT JOIN (SELECT product_id, file_name
                    FROM product_file
                    GROUP BY product_id) pf ON p.id = pf.product_id
ORDER BY p.end_time;

DESC product;

# user_id NOT NULL로 바꿔야 함
ALTER TABLE product
    MODIFY user_id INT NULL;

ALTER TABLE product_file
    MODIFY file_name VARCHAR(400) NOT NULL;

SELECT *
FROM product_file;

DESC product_file;