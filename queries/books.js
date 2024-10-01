const getBooksQuery = `
    SELECT books.id, books.name, authors.name AS author, books.year
    FROM books
    JOIN authors ON books.author_id = authors.id
    WHERE books.name LIKE ?;
`;

const getUserBooksQuery = `
    SELECT books.id, books.name, books.year, book_instances.photo_link
    FROM book_instances
    JOIN books ON book_instances.book_id = books.id
    WHERE book_instances.user_id = ?;
`;

const createBookInstanceQuery = `
    INSERT INTO book_instances (user_id, book_id)
    VALUES (?, ?);
`

module.exports = { getBooksQuery, getUserBooksQuery, createBookInstanceQuery };