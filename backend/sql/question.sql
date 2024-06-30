SELECT qb.id, qb.title, user.nick_name as nickName, qb.inserted
FROM question_board qb
         JOIN user
              ON qb.user_id = user.id;

SELECT qb.id, qb.title, qb.content, qb.inserted, user.nick_name nickName
FROM question_board qb
         JOIN user ON qb.user_id = user.id
WHERE qb.id = 1;

SELECT file_name
FROM question_board_file
WHERE question_id = 2;

use prj3;

desc question_board;
desc question_board_file;
desc question_board_comment;

ALTER TABLE question_board_file
    MODIFY COLUMN file_name varchar(200) NOT NULL;

SELECT *
FROM question_board_comment
WHERE question_id = 31;

SELECT user_id
FROM question_board_comment
WHERE question_id = 31;

SELECT COUNT(user_id)
FROM question_board_comment
WHERE question_id = 31;

INSERT INTO authority (user_id, name)
VALUES (58, 'user');

ALTER TABLE question_board
    ADD COLUMN number_of_count INT DEFAULT 0 NOT NULL;

SELECT qb.id, qb.user_id, qb.question_id, qb.content, qb.inserted, user.nick_name
FROM question_board_comment qb
         JOIN user ON qb.user_id = user.id
WHERE question_id = 31;

INSERT INTO authority(user_id, name)
VALUES (59, 'admin');

SELECT qb.id,
       qb.title,
       user.nick_name         as nickName,
       qb.number_of_count,
       qb.inserted,
       COUNT(qbf.question_id) as numberOfFiles,
       COUNT(qbc.question_id) as numberOfComments
FROM question_board qb
         JOIN user ON qb.user_id = user.id
         LEFT JOIN question_board_file qbf ON qb.id = qbf.question_id
         LEFT JOIN question_board_comment qbc ON qb.id = qbc.question_id
WHERE qb.id = 28;

SELECT qb.id,
       qb.title,
       user.nick_name AS nickName,
       qb.number_of_count,
       qb.inserted,
       qbf.numberOfFiles,
       qbc.numberOfComments
FROM question_board qb
         JOIN user ON qb.user_id = user.id
         LEFT JOIN (SELECT question_id, COUNT(*) AS numberOfFiles
                    FROM question_board_file
                    GROUP BY question_id) qbf ON qb.id = qbf.question_id
         LEFT JOIN (SELECT question_id, COUNT(*) AS numberOfComments
                    FROM question_board_comment
                    GROUP BY question_id) qbc ON qb.id = qbc.question_id
WHERE qb.id = 28;

UPDATE question_board_comment
SET content='잘 안되시면 다시 글 남겨주세요',
    inserted=now()
WHERE id = 47;

ALTER TABLE question_board
    ADD COLUMN secretWrite INT DEFAULT 0 NOT NULL;

ALTER TABLE question_board
    CHANGE COLUMN secretWrite secret_write BOOLEAN DEFAULT FALSE NOT NULL;

CREATE TABLE faqCategory
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(10) NOT NULL
);

CREATE TABLE faq
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    category INT,
    title    VARCHAR(200)  NOT NULL,
    content  VARCHAR(2000) NOT NULL,
    FOREIGN KEY (category) REFERENCES faqCategory (id)
);

INSERT INTO faqCategory (name)
VALUES ('기타');

desc faq;
desc faqCategory;
DELETE
FROM faq
WHERE id = 2;

INSERT INTO faq (category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매/입찰/결제'),
        '경매에 참여하고 싶어요',
        '원하는 상품을 클릭한 후 "참여하기" 버튼을 클릭하여 입찰 금액을 적습니다.\n입찰 금액은 입찰 시작가 보다 높아야 합니다.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매/입찰/결제'),
        '낙찰 여부를 알고 싶습니다',
        '경매 마감시간 이후 마이페이지에서 낙찰 여부를 확인하실 수 있습니다.\n오른쪽 상단 프로필 사진 > 입찰 내역 에서 낙찰 확인이 가능합니다.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매/입찰/결제'),
        '결제는 어떻게 하나요?',
        '낙찰이 되면 채팅방에서 결제하기 버튼을 눌러 결제를 진행합니다.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매톡'),
        '경매톡은 무엇인가요?',
        '채팅방은 판매자와 1:1 소통이 가능한 곳입니다.\n입찰 여부와 관계없이 판매자와 대화가 가능하니 궁금한 내용을 질문해보세요.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매톡'),
        '판매자와 채팅은 어떻게 하나요?',
        '상품 상세페이지에서 "문의하기" 버튼을 눌러주세요.\n해당 버튼을 누르면 판매자와 채팅할 수 있는 채팅방으로 이동합니다.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '회원'),
        '악성유저를 신고하고 싶어요',
        '해당 유저가 판매하는 상품의 상세페이지에서 "신고하기" 버튼을 눌러주세요.\n해당 유저의 마이페이지에서도 신고가 가능합니다');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '기타'),
        '문의하고 싶은 내용이 있습니다',
        '고객센터 > 1:1문의게시판에서 문의 하실 수 있습니다.\n 비밀글도 가능하니 글을 남겨보세요.\n관리자가 댓글로 답변해드립니다.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '기타'),
        '자유게시판에는 어떤 글을 올릴 수 있나요?',
        '자유게시판은 자유롭게 의견을 나누고 다양한 주제를 다룰 수 있는 공간입니다. \n 일상 이야기부터 취미, 관심사, 질문, 고민 상담 등 무엇이든 공유하실 수 있습니다. \n다른 이용자에게 불편함을 주지 않는 선에서 자유롭게 의견을 나누시길 바랍니다.');

UPDATE faqCategory
SET name='채팅방'
WHERE name = '경매톡';

UPDATE faq
SET title='채팅방은 무엇인가요?'
WHERE id = 5;

UPDATE faq
SET content='낙찰이 되면 채팅방에서 결제하기 버튼을 눌러 결제를 진행합니다.\n카드 결제와 간편결제를 이용하실 수 있습니다.\n카드사의 페이 서비스 및 PAYCO, L.PAY, SSGPAY, toss Pay, SAMSUNG Pay 로 결제가 가능합니다.'
WHERE id = 4;

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매/입찰/결제'),
        '경매 참여 시 유의사항을 알고 싶어요',
        '경매 참여는 신중하게 결정해야 합니다.\n중복 참여는 가능하나 마지막으로 기록된 입찰 금액으로만
                    경매에 참여하게 됩니다.\n경매 종료 후 낙찰여부는 마이 페이지 입찰내역에서 확인 가능합니다.\n입찰 금액을 입력할 때 반드시 제시된 가격보다 같거나 높아야
                    합니다.');

UPDATE faq
SET content='경매 참여는 신중하게 결정해야 합니다.\n중복 참여는 가능하나 마지막으로 기록된 입찰 금액으로만 경매에 참여하게 됩니다.\n경매 종료 후 낙찰여부는 마이 페이지 입찰내역에서 확인 가능합니다.\n입찰 금액을 입력할 때 반드시 제시된 가격보다 같거나 높아야 합니다.'
WHERE id = 10;

UPDATE faq
SET title='문의하고 싶은 내용이 있어요'
WHERE id = 8;

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '기타'),
        '찜하기는 어떤 기능인가요?',
        '관심 있는 상품을 등록 하는 기능입니다.\n 찜하기를 누르면 "마이경매" 페이지에서 찜 목록을 확인 하실 수 있습니다.\n관심 있는 상품을 등록하고 경매에 참여해보세요.');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '회원'),
        '소셜 로그인도 가능하나요?',
        '네. 로그인 페이지에서 카카오 로그인, 네이버 로그인, 구글 로그인이 가능합니다\n');

INSERT INTO faq(category, title, content)
VALUES ((SELECT id FROM faqCategory WHERE name = '경매/입찰/결제'),
        '낙찰 금액을 알 수 있나요?',
        '판매 종료 된 상품의 상세페이지로 이동하면 낙찰 금액을 알 수 있습니다.\n');

ALTER TABLE question_board_file
    DROP PRIMARY KEY;

ALTER TABLE question_board_file
    ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE question_board_file
    DROP FOREIGN KEY question_board_file_ibfk_1;

desc question_board_file;

ALTER TABLE question_board_file
    MODIFY COLUMN id INT AUTO_INCREMENT FIRST;

ALTER TABLE question_board_file
    ADD CONSTRAINT question_board_file_ibfk_1
        FOREIGN KEY (question_id) REFERENCES question_board (id);

desc question_board;

