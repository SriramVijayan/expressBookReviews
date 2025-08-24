const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if ((!username) && (!password)) {
    res.status(401).json({message: "Username and password not provided"});
  } else if(!username) {
    res.status(401).json({message: "Username not provided"});
  } else if(!password) {
    res.status(401).json({message: "Password not provided"});
  } else {
    existingUser = users.filter((user) => user.username === username);
    if (existingUser.length > 0) {
        res.send("User already registered");
    } else {
        users.push({"username": username, "password": password});
        res.send(`User with name ${username} registered`);
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  let myPromise = new Promise((resolve, reject) => {
    resolve("Success");
  })

  myPromise.then((successMessage) => {
    res.send(JSON.stringify(books,null,10));
  })
});

async function asyncFunction(req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
}

public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  asyncFunction(req, res);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let j = 1;
  let books_by_author = {};
  let myPromise = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const author = req.params.author;
    for(let i=0; i < keys.length; i++) {
      if (books[parseInt(keys[i])]["author"] == author) {
          books_by_author[parseInt(j)] = books[parseInt(keys[i])];
          j += 1;
      }
    }  
    resolve("Success");
  });

  myPromise.then((successMessage) => {
    res.send(JSON.stringify(books_by_author, null, j-1));
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let j = 1;
    let books_by_title = {}
    let myPromise = new Promise((resolve, reject) => {
        const title = req.params.title;
        const keys = Object.keys(books);
        for (let i = 0; i < keys.length; i++) {
          if(books[keys[i]]["title"] == title) {
              books_by_title[j] = books[keys[i]];
              j += 1;
          }
        }
        resolve("Success");
    })

    myPromise.then((successMessage) => {
        res.send(JSON.stringify(books_by_title, null, j-1));
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[parseInt(isbn)]["reviews"]);
});

module.exports.general = public_users;
