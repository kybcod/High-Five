USE prj3;

# Too many connections
SHOW STATUS LIKE 'threads_connected'; # 148
SHOW VARIABLES LIKE 'max_connections'; # 300
SHOW VARIABLES LIKE 'wait_timeout'; #28800
SET GLOBAL MAX_CONNECTIONS = 300;



SELECT *
FROM product_like;

SELECT *
FROM bid_list
WHERE product_id = 18;

UPDATE bid_list
SET bid_price = 90
WHERE product_id = 18
  AND user_id = 10;

SELECT *
FROM user;

SELECT *
FROM product;

SELECT *
FROM chat;

SELECT *
FROM chat_room;

SELECT *
FROM product
WHERE id = 18;


# 123가 파워에이드 낙찰
# userId : 20, productId : 18, title(주문자명 : name)
# product 테이블 : product_id, user_id 가져오기
# user 테이블 : nick_name(buyerName), phone_number(buyerTel), email(buyerEmail)
# bidList 테이블 : product 테이블에서 가져오는 productId에 해당 하는 bid_price 중 Max(bid_price)
# merchant_uid : 상품 주문번호를 가져오기 => random 함수 Payment 클래스에 작성
# bidList 에는 입찰에 참여한 사람의 userId가 있음 하지만 우리가 필요한 것은 상품의 주인 userId

SELECT p.id              AS productId,
       bl.user_id        AS userId,
       u.nick_name       AS buyerName,
       u.phone_number    AS buyerTel,
       u.email           AS buyerEmail,
       MAX(bl.bid_price) AS amount,
       p.title           AS name
FROM product p
         JOIN bid_list bl ON bl.product_id = p.id
         JOIN user u ON bl.user_id = u.id
WHERE u.id = 20
  AND p.id = 18
GROUP BY p.id;



