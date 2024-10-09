const {getDbConnection} = require("../db");

exports.create = async (params) => {
    const query = `
        INSERT INTO book_exchanges (user1_id, user2_id, book_id, exchange_status, exchange_date)
        VALUES (?, ?, ?, 1, NOW());
    `

    try {
        const pool = await getDbConnection();
        const [ResultSetHeader] = await pool.query(query, [params.user1, params.user2, params.book]);

        return ResultSetHeader.insertId;
    } catch (e) {
        console.log(e);
    }
}

exports.get = async (params) => {
    const query = `
        SELECT
            book_exchanges.id AS id,
            book_exchanges.user1_id AS user1_id,
            book_exchanges.user2_id AS user2_id,
            book_exchanges.book_id AS book_id,
            book_exchanges.exchange_status AS exchange_status,
            book_instances.photo_link AS photo_link,
            books.name AS name,
            books.year AS year,
            users.first_name,
            users.middle_name,
            users.last_name,
            users.picture,
            users.phone,
            users.address
        FROM book_exchanges
        JOIN book_instances ON book_instances.id = book_exchanges.book_id
        JOIN books ON book_instances.book_id = books.id
        JOIN users ON book_instances.user_id = users.user_id
        WHERE user2_id = ? AND exchange_status = ? 
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [params.user, +params.status]);

        return rows;
    } catch (e) {
        console.log(e);
    }
}

exports.getMy = async (params) => {
    const query = `
        SELECT
            book_exchanges.id AS id,
            book_exchanges.user1_id AS user1_id,
            book_exchanges.user2_id AS user2_id,
            book_exchanges.book_id AS book_id,
            book_exchanges.exchange_status AS exchange_status,
            book_instances.photo_link AS photo_link,
            books.name AS name,
            books.year AS year,
            users.first_name,
            users.middle_name,
            users.last_name,
            users.picture,
            users.phone,
            users.address
        FROM book_exchanges
        JOIN book_instances ON book_instances.id = book_exchanges.book_id
        JOIN books ON book_instances.book_id = books.id
        JOIN users ON book_exchanges.user2_id = users.user_id
        WHERE user1_id = ? AND exchange_status = ? 
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [params.user, +params.status]);

        return rows;
    } catch (e) {
        console.log(e);
    }
}

exports.update = async (params) => {
    const query = `
        UPDATE book_exchanges
        SET exchange_status = ?
        WHERE id = ?;
    `

    try {
        const pool = await getDbConnection();
        const [ResultSetHeader] = await pool.query(query, [params.status, +params.id]);

        return !!ResultSetHeader.affectedRows;
    } catch (e) {
        console.log(e);
    }
}
