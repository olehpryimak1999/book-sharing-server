require('dotenv').config();

const cors = require('cors');
const express = require('express');
const multer = require('multer');
const { Storage } = require("@google-cloud/storage");
const { getBooks, getUserById, createUser, getBooksByUser, createBookInstance, updateBookInstancePicture, getUserBookById, deleteBook } = require('./requests');
const { verify, getUserInfoByToken } = require('./auth');

const upload = multer({
    storage: multer.memoryStorage(),
});

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
});

app.post(`${API_PREFIX}/my-books`, upload.single('file'), async (req, res) => {
    const token = req.headers.authorization;
    const id = await verify(token);

    if (!id) {
        return res.status(401).send('Unauthorized');
    }

    let user = await getUserById({ id });
    const createdId = await createBookInstance({ user: user.user_id, book: req.body.book_id });

    const storage = new Storage({
        keyFilename: "service-account.json",
    });

    try {
        const bucketName = 'books-storage-images';
        const bucket = storage.bucket(bucketName);

        const blob = bucket.file(`picture-${createdId}`);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            console.error('Помилка при завантаженні:', err);
            res.status(500).send('Помилка при завантаженні файлу');
        });

        blobStream.on('finish', async () => {
            await blob.makePublic();
            await updateBookInstancePicture({ id: createdId, picture: `https://storage.googleapis.com/${bucketName}/${blob.name}` });

            res.status(201).send();
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Помилка:', error);
        res.status(500).send('Сталася помилка');
    }
});

app.delete(`${API_PREFIX}/my-books/:id`, async (req, res) => {
    const token = req.headers.authorization;
    const id = await verify(token);

    if (!id) {
        return res.status(401).send('Unauthorized');
    }

    const user = await getUserById({ id });
    const bookId = req.params.id;
    const book = await getUserBookById({ id: bookId, user_id: user.user_id });

    if (!book) {
        return res.status(404).send('Книга не знайдена');
    }

    const storage = new Storage({
        keyFilename: "service-account.json",
    });

    const bucketName = 'books-storage-images';
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`picture-${book.id}`);

    await file.delete();
    await deleteBook({ id: book.id });

    res.status(200).send('Книга успішно видалена');
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