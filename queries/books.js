const getBooksQuery = `
    SELECT books.id, books.name, authors.name AS author, books.year
    FROM books
    JOIN authors ON books.author_id = authors.id
    WHERE books.name LIKE ?;
`;

const getUserBooksQuery = `
    SELECT book_instances.id, books.name, books.year, authors.name AS author, book_instances.photo_link
    FROM book_instances
    JOIN books ON book_instances.book_id = books.id
    JOIN authors ON books.author_id = authors.id
    WHERE book_instances.user_id = ?;
`;

const createBookInstanceQuery = `
    INSERT INTO book_instances (user_id, book_id)
    VALUES (?, ?);
`

const updateBookInstancePictureQuery = `
    UPDATE book_instances
    SET photo_link = ?
    WHERE id = ?;
`

const getUserBookByIdQuery = `
    SELECT id, photo_link
    FROM book_instances
    WHERE user_id = ? AND id = ?;
`

const deleteBookQuery = `
    DELETE
    FROM book_instances
    WHERE id = ?;
`

module.exports = {
    getBooksQuery,
    getUserBooksQuery,
    createBookInstanceQuery,
    updateBookInstancePictureQuery,
    getUserBookByIdQuery,
    deleteBookQuery
};