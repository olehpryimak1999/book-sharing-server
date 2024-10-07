const {getDbConnection} = require("../db");

exports.getBooks = async (params) => {
    const whereClause = [];
    const whereParams = [];
    const page = params.page || 1;
    const limit = 10;

    if (params.searchQuery) {
        whereClause.push('books.name LIKE ?');
        whereParams.push(`%${params.search}%`);
    }

    if (params.selectedAuthor) {
        whereClause.push('author.name = ?');
        whereParams.push(params.selectedAuthor);
    }

    const whereStr = whereClause.length ? `WHERE ${whereClause.join(',')}` : '';

    const query = `
        SELECT books.id, books.name, authors.name AS author, books.year
        FROM books
        JOIN authors ON books.author_id = authors.id
        ${whereStr}
        LIMIT ? OFFSET ?;
    `;

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query(query, [...whereParams, limit, (page - 1) * limit]);

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