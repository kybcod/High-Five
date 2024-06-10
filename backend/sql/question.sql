SELECT qb.id, qb.title, qb.inserted, user.nick_name
FROM question_board qb
         JOIN user
WHERE qb.user_id = user.id;