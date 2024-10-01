const getBooksQuery = `
    SELECT books.id, books.name, authors.name AS author, books.year
    FROM books
    JOIN authors ON books.author_id = authors.id
    WHERE books.name LIKE ?;
`;

module.exports = { getBooksQuery };