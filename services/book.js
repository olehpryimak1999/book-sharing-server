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

exports.getBooksByUser = async (params) => {
    const query = `
        SELECT book_instances.id, books.name, books.year, authors.name AS author, book_instances.photo_link
        FROM book_instances
        JOIN books ON book_instances.book_id = books.id
        JOIN authors ON books.author_id = authors.id
        WHERE book_instances.user_id = ?;
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [params.user_id]);

        return rows;
    } catch (e) {
        console.log(e);
    }
}

exports.createBookInstance = async (params) => {
    const query = `
        INSERT INTO book_instances (user_id, book_id)
        VALUES (?, ?);
    `

    try {
        const pool = await getDbConnection();
        const [ResultSetHeader] = await pool.query(query, [params.user, params.book]);

        return ResultSetHeader.insertId;
    } catch (e) {
        console.log(e);
    }
}

exports.updateBookPicture = async (params) => {
    const query = `
        UPDATE book_instances
        SET photo_link = ?
        WHERE id = ?;
    `

    try {
        const pool = await getDbConnection();
        const [ResultSetHeader] = await pool.query(query, [params.picture, params.id]);

        return !!ResultSetHeader.affectedRows;
    } catch (e) {
        console.log(e);
    }
}



exports.getUserBookById = async (params) => {
    const query = `
        SELECT id, photo_link
        FROM book_instances
        WHERE user_id = ? AND id = ?;
    `

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [params.user_id, params.id]);

        return rows.length ? rows[0] : null;
    } catch (e) {
        console.log(e);
    }
}

exports.deleteBook = async (params) => {
    const query = `
        DELETE
        FROM book_instances
        WHERE id = ?;
    `

    try {
        const pool = await getDbConnection();
        const [ResultSetHeader] = await pool.query(query, [params.id]);

        return !!ResultSetHeader.affectedRows;
    } catch (e) {
        console.log(e);
    }
}
