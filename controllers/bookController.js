const fileService = require('../services/files');
const bookService = require('../services/book');


exports.books = async (req, res) => {
    const books = await bookService.getBooks({ search: req.query.search });

    res.json(books);
}

exports.my = async (req, res) => {
    const books = await bookService.getBooksByUser(req.user);

    res.json(books);
}

exports.create = async (req, res) => {
    const createdId = await bookService.createBookInstance({ user: req.user.user_id, book: req.body.book_id });

    const picture = await fileService.uploadPhotoFromBuffer({ bucketName: 'books-storage-images', name: `picture-${createdId}`, file: req.file.buffer })

    await bookService.updateBookPicture({ id: createdId, picture });

    res.status(201).send();
}

exports.delete = async (req, res) => {
    const book = await bookService.getUserBookById({ id: req.params.id, user_id: req.user.user_id });

    if (!book) {
        return res.status(404).send('Книга не знайдена');
    }

    await fileService.deleteFile({ bucketName: 'books-storage-images', name: `picture-${book.id}` });
    await bookService.deleteBook({ id: book.id });

    res.status(200).send('Книга успішно видалена');
}

exports.getBooksToExchange = async (req, res) => {
    const books = await bookService.getBooksForExchange(req.user);

    res.json(books);
}