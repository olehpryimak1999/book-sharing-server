const {getDbConnection} = require("../db");

exports.getUserById = async (params) => {
    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?;', [`${params.id}`]);

        return rows.length ? rows[0] : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

exports.createUser = async (params) => {
    const query = `
        INSERT INTO users (google_id, email, first_name, last_name, picture, created_at, last_login)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW());
    `;

    try {
        const pool = await getDbConnection();
        await pool.query(query, [params.sub, params.email, params.given_name, params.family_name, params.picture]);
    } catch (e) {
        console.log(e);
    }
}

exports.updateUser = async (params) => {
    const query = `
        UPDATE users
        SET address = ?
        WHERE user_id = ?;
    `

    try {
        const pool = await getDbConnection();
        await pool.query(query, [params.address, params.user_id]);
    } catch (e) {
        console.log(e);
    }
}