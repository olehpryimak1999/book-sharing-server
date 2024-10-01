require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { getBooks, getUserById, createUser, getBooksByUser, createBookInstance } = require('./requests');
const { verify, getUserInfoByToken } = require('./auth');

const app = express();
const PORT = 3000;
const API_PREFIX = '/api';

app.use(cors());
app.use(express.json())

app.get(`${API_PREFIX}/user_info`, async (req, res) => {
    const token = req.headers.authorization;
    const id = await verify(token);

    if (!id) {
        return res.send(401, 'Unauthorized');
    }

    let user = await getUserById({ id });

    if (!user) {
        const userInfo = await getUserInfoByToken(token);
        await createUser(userInfo);
        user = await getUserById({ id });
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, ...user }));
})

app.get(`${API_PREFIX}/books`, async (req, res) => {
    const token = req.headers.authorization;
    const id = await verify(token);

    if (!id) {
        return res.send(401, 'Unauthorized');
    }

    const books = await getBooks({ search: req.query.search });

    res.json(books);
});

app.get(`${API_PREFIX}/my-books`, async (req, res) => {
    const token = req.headers.authorization;
    const id = await verify(token);

    if (!id) {
        return res.send(401, 'Unauthorized');
    }

    let user = await getUserById({ id });

    const books = await getBooksByUser(user);

    res.json(books);
})

app.post(`${API_PREFIX}/my-books`, async (req, res) => {
    const token = req.headers.authorization;
    const id = await verify(token);

    if (!id) {
        return res.send(401, 'Unauthorized');
    }

    let user = await getUserById({ id });
    const createdId = await createBookInstance({ user: user.user_id, book: req.body.book_id });

    res.json({ id: createdId });
})

app.get(`${API_PREFIX}`, (req, res) => {
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