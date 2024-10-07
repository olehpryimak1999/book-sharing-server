const {getDbConnection} = require("../db");

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

exports.getBooksForExchange = async (params) => {
    const query = `
        SELECT book_instances.id, book_instances.photo_link, users.address AS userAddress, users.phone AS userPhone, users.first_name, users.middle_name, users.last_name
        FROM book_instances
        JOIN users ON book_instances.user_id = users.user_id
        WHERE book_instances.book_id = ? AND book_instances.user_id <> ?;
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [+params.book, params.user_id]);

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



exports.getBookById = async (params) => {
    const query = `
        SELECT *
        FROM book_instances
        WHERE id = ?;
    `

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [params.id]);

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
