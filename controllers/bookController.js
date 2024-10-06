const bookService = require('../services/book');

exports.books = async (req, res) => {
    const books = await bookService.getBooks({ search: req.query.search });

    res.json(books);
}