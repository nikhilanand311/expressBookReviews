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

// Function to get all books using Promise
function getAllBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Function to get book by ISBN using Promise
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
}

// Function to get books by author using Promise
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
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
  });
}

// Function to get books by title using Promise
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
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
  });
}

// Task 10: Get all books using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
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