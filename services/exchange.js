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
