const { getDbConnection } = require('./db');
const { getBooksQuery, getUserBooksQuery, createBookInstanceQuery, updateBookInstancePictureQuery } = require('./queries/books');
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

async function getBooksByUser(params) {
    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(getUserBooksQuery, [params.user_id]);

        return rows;
    } catch (e) {
        console.log(e);
    }
}

async function createBookInstance(params) {
    try {
        const pool = await getDbConnection();
        const [ResultSetHeader] = await pool.query(createBookInstanceQuery, [params.user, params.book]);

        return ResultSetHeader.insertId;
    } catch (e) {
        console.log(e);
    }
}

async function updateBookInstancePicture(params) {
    try {
        const pool = await getDbConnection();
        await pool.query(updateBookInstancePictureQuery, [params.picture, params.id]);

        return;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getBooks, getUserById, createUser, getBooksByUser, createBookInstance, updateBookInstancePicture };