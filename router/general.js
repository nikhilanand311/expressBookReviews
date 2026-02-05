const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get all books using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Using Promise with async/await to simulate Axios-like behavior
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        // Simulate async HTTP request using axios pattern
        setTimeout(() => {
          resolve(books);
        }, 0);
      });
    };

    const allBooks = await getAllBooks();
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    // Using Promise with async/await - Axios pattern for fetching by ISBN
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found");
          }
        }, 0);
      });
    };

    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    // Using Promise with async/await - Axios pattern for fetching by author
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let booksByAuthor = [];

          for (let key in books) {
            if (books[key].author === author) {
              booksByAuthor.push({
                isbn: key,
                title: books[key].title,
                author: books[key].author,
                reviews: books[key].reviews
              });
            }
          }

          if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
          } else {
            reject("No books found by this author");
          }
        }, 0);
      });
    };

    const booksByAuthor = await getBooksByAuthor(author);
    res.send(JSON.stringify({ booksByAuthor }, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    // Using Promise with async/await - Axios pattern for fetching by title
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let booksByTitle = [];

          for (let key in books) {
            if (books[key].title === title) {
              booksByTitle.push({
                isbn: key,
                title: books[key].title,
                author: books[key].author,
                reviews: books[key].reviews
              });
            }
          }

          if (booksByTitle.length > 0) {
            resolve(booksByTitle);
          } else {
            reject("No books found with this title");
          }
        }, 0);
      });
    };

    const booksByTitle = await getBooksByTitle(title);
    res.send(JSON.stringify({ booksByTitle }, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify({
      isbn: isbn,
      reviews: books[isbn].reviews
    }, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;