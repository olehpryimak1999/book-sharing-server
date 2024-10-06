const fileService = require('../services/files');
const instanceService = require('../services/instance');

exports.my = async (req, res) => {
    const books = await instanceService.getBooksByUser(req.user);

    res.json(books);
}

exports.create = async (req, res) => {
    const createdId = await instanceService.createBookInstance({ user: req.user.user_id, book: req.body.book_id });

    const picture = await fileService.uploadPhotoFromBuffer({ bucketName: 'books-storage-images', name: `picture-${createdId}`, file: req.file.buffer })

    await instanceService.updateBookPicture({ id: createdId, picture });

    res.status(201).send();
}

exports.delete = async (req, res) => {
    const book = await instanceService.getBookById({ id: req.params.id, user_id: req.user.user_id });

    if (!book || book.user_id !== req.user.user_id) {
        return res.status(404).send('Книга не знайдена');
    }

    await fileService.deleteFile({ bucketName: 'books-storage-images', name: `picture-${book.id}` });
    await instanceService.deleteBook({ id: book.id });

    res.status(200).send('Книга успішно видалена');
}

exports.getBooksToExchange = async (req, res) => {
    const books = await instanceService.getBooksForExchange(req.user);

    res.json(books);
}

exports.getBookById = async (req, res) => {
    const book = await instanceService.getBookById({ id: req.id });

    res.json(book);
}