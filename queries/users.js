const getUserQuery = `
    SELECT *
    FROM users
    WHERE google_id = ?;
`

const createUserQuery = `
    INSERT INTO users (google_id, email, name, profile_picture, created_at, last_login)
    VALUES (?, ?, ?, ?, NOW(), NOW());
`;

module.exports = { getUserQuery, createUserQuery };