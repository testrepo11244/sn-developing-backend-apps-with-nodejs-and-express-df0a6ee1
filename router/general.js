/**
 * router/general.js
 * Final Project - "Developing Back-End Apps with Node.js and Express" (IBM)
 *
 * Public (unauthenticated) routes of the expressBookReview application.
 *
 * Task 11 requirement: all books and their details are retrieved based on
 * author, title and ISBN using Promise callbacks or async/await with Axios.
 *
 * NOTE: Axios must be installed for the async handlers:  npm install axios
 */

const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Base URL of the running Book Review server (used by the Axios calls below).
const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

/**
 * Helper used by the Axios-based handlers.
 * Depending on the response Content-Type, Express may deliver the "/"
 * payload as a JSON string or as an already-parsed object, so both
 * cases are handled here before the books are filtered.
 */
const extractBooks = (data) => {
  const payload = typeof data === "string" ? JSON.parse(data) : data;
  return payload.books ? payload.books : payload;
};

/* -------------------------------------------------------------------------- */
/* Task 7: Register a new user                                                */
/* -------------------------------------------------------------------------- */
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

/* -------------------------------------------------------------------------- */
/* Task 2: Get the book list available in the shop (ALL books)                */
/* Implemented with async/await: the data access is wrapped in a Promise so   */
/* the route handler retrieves the complete book collection asynchronously.   */
/* -------------------------------------------------------------------------- */
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    if (books && Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject(new Error("No books are currently available"));
    }
  });
};

public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).type('application/json')
      .send(JSON.stringify({ books: allBooks }, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* Task 3: Get book details based on ISBN                                     */
/* Implemented with async/await and Axios: the full book list is fetched from */
/* the running server and the entry matching the requested ISBN is returned.  */
/* -------------------------------------------------------------------------- */
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = extractBooks(response.data);
    const book = allBooks[isbn];

    if (book) {
      return res.status(200).send(book);
    }
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details by ISBN" });
  }
});

/* -------------------------------------------------------------------------- */
/* Task 4: Get book details based on Author                                   */
/* Implemented with async/await and Axios: the full book list is fetched from */
/* the running server and filtered by the requested author.                   */
/* -------------------------------------------------------------------------- */
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = extractBooks(response.data);
    const booksByAuthor = Object.values(allBooks).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (booksByAuthor.length > 0) {
      return res.status(200).send(booksByAuthor);
    }
    return res.status(404).json({ message: "No books found for the given author" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

/* -------------------------------------------------------------------------- */
/* Task 5: Get all books based on Title                                       */
/* Implemented with async/await and Axios: the full book list is fetched from */
/* the running server and filtered by the requested title.                    */
/* -------------------------------------------------------------------------- */
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = extractBooks(response.data);
    const booksByTitle = Object.values(allBooks).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (booksByTitle.length > 0) {
      return res.status(200).send(booksByTitle);
    }
    return res.status(404).json({ message: "No books found for the given title" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

/* -------------------------------------------------------------------------- */
/* Task 6: Get book review based on ISBN                                      */
/* -------------------------------------------------------------------------- */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(book.reviews);
  }
  return res.status(404).json({ message: "Book not found for the given ISBN" });
});

module.exports.general = public_users;