const {getDbConnection} = require("../db");

exports.getUserById = async (params) => {
    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?;', [`${params.id}`]);

        return rows.length ? rows[0] : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

exports.getUserByGoogleId = async (params) => {
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

exports.updateUser = async (updates) => {
    const updatableFields = ['email', 'last_name', 'first_name', 'middle_name', 'picture', 'phone', 'address'];
    const allowedFields = Object.keys(updates).filter(field => updatableFields.includes(field));
    const query = `UPDATE users SET ${allowedFields.map(field => `${field} = ?`).join(', ')} WHERE user_id = ?`;

    try {
        const pool = await getDbConnection();
        await pool.query(query, [...allowedFields.map(field => updates[field]), updates.id]);
    } catch (e) {
        console.log(e);
    }
}