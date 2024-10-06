const {getDbConnection} = require("../db");

exports.getBooks = async (params) => {
    const query = `
        SELECT books.id, books.name, authors.name AS author, books.year
        FROM books
        JOIN authors ON books.author_id = authors.id
        WHERE books.name LIKE ?;
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [`%${params.search}%`]);

        return rows;
    } catch (e) {
        return  [];
    }
}

exports.getBookById = async (params) => {
    const query = `
        SELECT books.id, books.name, authors.name AS author, books.year
        FROM books
        JOIN authors ON books.author_id = authors.id
        WHERE books.id = ?;
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [params.id]);

        return rows.length ? rows[0] : null;
    } catch (e) {
        return  [];
    }
}