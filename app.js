require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;
const API_PREFIX = '/api';

app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_BASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});

app.get(`${API_PREFIX}/books`, (req, res)=>{
    const query = `
        SELECT books.id, books.name, authors.name AS author, books.year
        FROM books
        JOIN authors ON books.author_id = authors.id
        WHERE books.name LIKE ?;
    `;

    db.query(query, [`%${req.query.search}%`], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
});

app.get(`${API_PREFIX}`, (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server!");
});

app.listen(PORT, (error) =>{
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    } else
        console.log("Error occurred, server can't start", error);
    }
);