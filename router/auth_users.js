const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  // Check if username exists in users array
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  // Check if username and password match the one we have in records
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Check if user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "Login successful!" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  // Check if review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Check if book exists
  if (books[isbn]) {
    // Add or update the review for this user
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // Check if book exists
  if (books[isbn]) {
    // Check if user has a review for this book
    if (books[isbn].reviews[username]) {
      // Delete the review
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: "Review for ISBN " + isbn + " deleted"
      });
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;