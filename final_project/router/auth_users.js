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
  const username = req.session.authorization['accessToken'];

  let bookreviews = books[parseInt(isbn_code)]["reviews"];
  res.send(bookreviews);

  let username_exists = false;
  for (let i=0; i < bookreviews.length; i++) {
    if (bookreviews[i].username == username) {
        bookreviews[i].review = review;
        username_exists = true;
        break;
    }
  }

  if(username_exists == false) {
    bookreviews.push({"username": username, "review": review});
  }

//   const filterReview = bookreviews.filter((bookreview) => bookreview.username !== username);
//   if (existingReview >= 0) {
//     bookreviews[existingReview].review = review;
//   } else {
//     bookreviews.push({"username": username, "review": review});
//   }
  
  books[parseInt(isbn_code)]["reviews"] = bookreviews;

  res.send(books[parseInt(isbn_code)]);

//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
