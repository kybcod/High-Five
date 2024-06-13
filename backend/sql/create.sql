-- user 테이블
CREATE TABLE user
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    email        VARCHAR(30) NOT NULL UNIQUE,
    password     VARCHAR(20) NOT NULL,
    nick_name    VARCHAR(10) NOT NULL UNIQUE,
    phone_number VARCHAR(13) NOT NULL UNIQUE,
    black_count  INT         NOT NULL DEFAULT 0,
    inserted     DATETIME    NOT NULL DEFAULT NOW()
);

# question board 테이블
CREATE TABLE question_board
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    user_id  INT           NOT NULL REFERENCES user (id),
    title    VARCHAR(50)   NOT NULL,
    content  VARCHAR(2000) NOT NULL,
    inserted DATETIME      NOT NULL DEFAULT NOW()
);

# question board file 테이블
CREATE TABLE question_board_file
(
    question_id INT         NOT NULL REFERENCES question_board (id),
    file_name   VARCHAR(50) NOT NULL,
    PRIMARY KEY (question_id, file_name)
);

# 권한 테이블
CREATE TABLE authority
(
    user_id INT         NOT NULL REFERENCES user (id),
    name    VARCHAR(10) NOT NULL,
    PRIMARY KEY (user_id, name)
);

# question board comment 테이블
CREATE TABLE question_board_comment
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT          NOT NULL REFERENCES question_board (id),
    user_id     INT          NOT NULL REFERENCES authority (user_id),
    content     VARCHAR(200) NOT NULL,
    inserted    DATETIME     NOT NULL DEFAULT NOW()
);

# 자유 게시판
CREATE TABLE board
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    user_id  INT           NOT NULL REFERENCES user (id),
    title    VARCHAR(50)   NOT NULL,
    content  VARCHAR(2000) NOT NULL,
    inserted DATETIME      NOT NULL DEFAULT NOW()
);

# 자유 게시판 file 테이블
CREATE TABLE board_file
(
    board_id  INT         NOT NULL REFERENCES question_board (id),
    file_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (board_id, file_name)
);

# board like 테이블
CREATE TABLE board_like
(
    board_id INT NOT NULL REFERENCES board (id),
    user_id  INT NOT NULL REFERENCES user (id),
    PRIMARY KEY (board_id, user_id)
);

# 자유 게시판 댓글
CREATE TABLE board_comment
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    board_id   INT          NOT NULL REFERENCES board (id),
    user_id    INT          NOT NULL REFERENCES user (id),
    content    VARCHAR(200) NOT NULL,
    inserted   DATETIME     NOT NULL DEFAULT NOW(),
    comment_id INT          NOT NULL DEFAULT 0
);

# 상품 테이블
CREATE TABLE product
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT           NOT NULL REFERENCES user (id),
    title         VARCHAR(50)   NOT NULL,
    category      VARCHAR(10)   NOT NULL,
    start_price   INT           NOT NULL DEFAULT 0,
    status        BOOLEAN       NOT NULL DEFAULT TRUE,
    content       VARCHAR(2000) NOT NULL,
    start_time    DATETIME      NOT NULL DEFAULT NOW(),
    end_time      DATETIME      NOT NULL,
    view_count    INT           NOT NULL DEFAULT 0,
    review_status BOOLEAN       NOT NULL DEFAULT FALSE
);

# 상품 파일 테이블
CREATE TABLE product_file
(
    product_id INT NOT NULL REFERENCES product (id),
    file_name  INT NOT NULL,
    PRIMARY KEY (product_id, file_name)
);

# 상품 찜 테이블
CREATE TABLE product_like
(
    product_id INT NOT NULL REFERENCES product (id),
    user_id    INT NOT NULL REFERENCES user (id),
    PRIMARY KEY (product_id, user_id)
);

# 리뷰 목록 테이블
CREATE TABLE review_list
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(30) NOT NULL
);

# 리뷰 후기 테이블
CREATE TABLE review
(
    product_id INT      NOT NULL REFERENCES product (id),
    user_id    INT      NOT NULL REFERENCES user (id),
    review_id  INT      NOT NULL REFERENCES review_list (id),
    inserted   DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY (product_id, user_id)
);

# 입찰 내역 테이블
CREATE TABLE bid_list
(
    product_id INT     NOT NULL REFERENCES product (id),
    user_id    INT     NOT NULL REFERENCES user (id),
    bid_price  INT     NOT NULL DEFAULT 0,
    status     BOOLEAN NOT NULL DEFAULT FALSE
);

# -- 변경 전
# 채팅 메시지 테이블
# CREATE TABLE message
# (
#     id           INT PRIMARY KEY AUTO_INCREMENT,
#     chat_room_id INT          NOT NULL REFERENCES chat_room (id),
#     user_id      INT          NOT NULL REFERENCES user (id),
#     content      VARCHAR(100) NOT NULL,
#     inserted     DATETIME     NOT NULL DEFAULT NOW()
# );

# 채팅방 테이블
# CREATE TABLE chat_room
# (
#     id       INT PRIMARY KEY AUTO_INCREMENT,
#     inserted DATETIME NOT NULL DEFAULT NOW(),
#     end_time DATETIME NULL
# );

# message 테이블 삭제
DROP TABLE message;
# chat_room 테이블 삭제
DROP TABLE chat_room;

# -- 변경 후
# 채팅방 테이블
CREATE TABLE chat_room
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT      NOT NULL REFERENCES product (id),
    seller_id  INT      NOT NULL REFERENCES product (user_id),
    user_id    INT      NOT NULL REFERENCES user (id),
    inserted   DATETIME NOT NULL DEFAULT NOW()
);

# 채팅 메시지 테이블
CREATE TABLE chat
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    chat_room_id INT          NOT NULL REFERENCES chat_room (id),
    user_id      INT          NOT NULL REFERENCES user (id),
    message      VARCHAR(100) NOT NULL,
    inserted     DATETIME     NOT NULL DEFAULT NOW()
);