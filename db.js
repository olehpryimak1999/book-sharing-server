require('dotenv').config();

const mysql = require('mysql2/promise');

let pool;

async function getDbConnection () {
    if (!pool) {
        pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_BASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    return pool;
}

module.exports = { getDbConnection };