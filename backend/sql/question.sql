SELECT qb.id, qb.title, user.nick_name as nickName, qb.inserted
FROM question_board qb
         JOIN user
              ON qb.user_id = user.id;