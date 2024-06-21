SELECT *
FROM user
;

ALTER TABLE user
    MODIFY COLUMN password VARCHAR(500) NOT NULL;

ALTER TABLE user
    MODIFY COLUMN phone_number VARCHAR(11) NOT NULL UNIQUE;

DESC user;

INSERT INTO authority
    (user_id, name)
VALUES (57, 'admin');

SELECT *
FROM authority;

SELECT name
FROM authority
WHERE user_id = 14;

SELECT u.id,
       u.email,
       u.password,
       u.nick_name,
       u.phone_number,
       u.black_count,
       u.inserted,
       a.name authority
FROM user u
         JOIN authority a ON u.id = a.user_id
WHERE email = 'bb@bb'
GROUP BY u.id;

INSERT INTO authority
    (user_id, name)
VALUES (14, 'user');

DELETE
FROM user
WHERE id = 6;

SELECT *
FROM code;

DELETE
FROM code
WHERE phone_number = '01071263769';


SELECT black_count, id, email
FROM user
;

UPDATE user
SET black_count = 0
WHERE id = 37;

SELECT *
FROM user_file;

# ALTER TABLE user_file
#     CHANGE file_name file_src VARCHAR(500);

# ALTER TABLE user_file
#     CHANGE file_src file_name VARCHAR(500);