const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return (user.username == username && user.password == password);
    });

    if(validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if((!username) || (!password)) {
    res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password},
        'access', {'expiresIn': 3600});

    req.session.authorization = {accessToken, username};

    res.status(200).json({message: "User successfully logged in"});
  } else {
    res.status(208).json({message: "Invalid login. Please check username and password"});
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn_code = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];

  let bookreviews = books[parseInt(isbn_code)]["reviews"];

  reviewUsers = Object.keys(bookreviews);
  existingUser = reviewUsers.find((user) => user == username);
  if (existingUser) {
    bookreviews[existingUser] = review;
    } else {
        bookreviews[username] = review;
    }

  books[parseInt(isbn_code)]["reviews"] = bookreviews;

  res.send(books[parseInt(isbn_code)]);

//   return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username'];
    const isbn_code = parseInt(req.params.isbn);

    let bookReviews = books[isbn_code]["reviews"];
    reviewUsers = Object.keys(bookReviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
