const { getDbConnection } = require('./db');
const { getBooksQuery } = require('./queries/books');
const { getUserQuery, createUserQuery } = require('./queries/users');

async function getBooks(params) {
    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(getBooksQuery, [`%${params.search}%`]);

        return rows;
    } catch (e) {
        return  [];
    }
}

async function getUserById(params) {
    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(getUserQuery, [`${params.id}`]);

        return rows.length ? rows[0] : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function createUser(params) {
    try {
        const pool = await getDbConnection();
        await pool.query(createUserQuery, [params.sub, params.email, params.name, params.picture]);
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getBooks, getUserById, createUser };