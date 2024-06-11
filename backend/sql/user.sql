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
VALUES (14, 'admin');

SELECT *
FROM authority;

SELECT name
FROM authority
WHERE user_id = 14;