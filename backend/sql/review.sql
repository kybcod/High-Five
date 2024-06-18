USE prj3;

INSERT INTO review_list (content)
VALUES ('판매자가 연락이 잘 돼요'),
       ('판매자가 싼 가격에 물건을 올렸어요');

INSERT INTO review_list (content)
VALUES ('판매자가 제가 있는 곳까지 와주셨어요'),
       ('판매자가 감사인사를 해줬어요'),
       ('판매자가 빠르게 배송을 해줬어요'),
       ('판매자와 쿨거래를 진행했어요'),
       ('판매자가 시간 약속을 잘 지켰어요');

SELECT *
FROM review;

UPDATE product
SET review_status = 0
WHERE id = 6;

SELECT status
FROM product
WHERE id = 6;

DELETE
FROM review;

INSERT INTO review_list (content)
VALUES ('매너 개똥망'),
       ('가격 파렴치함');

SELECT *
FROM review_list;

SELECT *
FROM product p
         RIGHT JOIN review r ON p.id = r.product_id;

SELECT *
FROM review;