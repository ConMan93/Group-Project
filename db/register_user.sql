INSERT INTO users (username, password, email, venmo, profile_img)
VALUES (${username}, ${password}, ${email}, ${venmo}, 'https://picsum.photos/200/300/?random')
RETURNING *;