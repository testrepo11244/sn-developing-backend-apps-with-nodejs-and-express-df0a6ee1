/**
 * general.js
 * ----------
 * Capstone Final Project — Developing Back-End Apps with Node.js and Express
 * Repository: forked from ibm-developer-skills-network/expressBookReview
 *
 * This module contains the client-side implementations for retrieving
 * books and their details from the ExpressBookReview REST API
 * (http://localhost:5000) using the Axios HTTP client.
 *
 * Implemented operations:
 *   1. getAllBooks()      - Retrieve the complete list of books   (async/await)
 *   2. getBookByISBN()    - Retrieve a book's details by ISBN    (Promise callbacks)
 *   3. getBooksByAuthor() - Retrieve all books by a given author (async/await)
 *   4. getBooksByTitle()  - Retrieve all books by a given title  (Promise callbacks)
 *
 * Both asynchronous styles required by the assignment are demonstrated:
 *   - async/await with try/catch
 *   - Promise callbacks (.then / .catch)
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000";

/* ------------------------------------------------------------------
 * 1. Get the list of all books — async/await with Axios
 * Endpoint: GET /
 * ------------------------------------------------------------------ */
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    const books = response.data;
    console.log("All books retrieved successfully:");
    console.log(JSON.stringify(books, null, 2));
    return books;
  } catch (error) {
    console.error(
      "Error fetching all books:",
      error.response ? `Status ${error.response.status}` : error.message
    );
  }
}

/* ------------------------------------------------------------------
 * 2. Get book details by ISBN — Promise callbacks with Axios
 * Endpoint: GET /isbn/:isbn
 * ------------------------------------------------------------------ */
function getBookByISBN(isbn) {
  return axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(`Book with ISBN ${isbn} retrieved successfully:`);
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch((error) => {
      console.error(
        `Error fetching book with ISBN ${isbn}:`,
        error.response ? `Status ${error.response.status}` : error.message
      );
    });
}

/* ------------------------------------------------------------------
 * 3. Get all books by author — async/await with Axios
 * Endpoint: GET /author/:author
 * ------------------------------------------------------------------ */
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`
    );
    const books = response.data;
    console.log(`Books by author "${author}" retrieved successfully:`);
    console.log(JSON.stringify(books, null, 2));
    return books;
  } catch (error) {
    console.error(
      `Error fetching books by author "${author}":`,
      error.response ? `Status ${error.response.status}` : error.message
    );
  }
}

/* ------------------------------------------------------------------
 * 4. Get all books by title — Promise callbacks with Axios
 * Endpoint: GET /title/:title
 * ------------------------------------------------------------------ */
function getBooksByTitle(title) {
  return axios
    .get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => {
      console.log(`Books with title "${title}" retrieved successfully:`);
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    })
    .catch((error) => {
      console.error(
        `Error fetching books with title "${title}":`,
        error.response ? `Status ${error.response.status}` : error.message
      );
    });
}

/* ------------------------------------------------------------------
 * Example usage (uncomment to run against a locally running server):
 *
 * (async () => {
 *   await getAllBooks();                       // all books
 *   await getBookByISBN("1");                  // book by ISBN
 *   await getBooksByAuthor("Chinua Achebe");   // books by author
 *   getBooksByTitle("Things Fall Apart");      // books by title
 * })();
 * ------------------------------------------------------------------ */

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
};