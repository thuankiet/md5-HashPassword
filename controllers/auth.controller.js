const shortId = require("shortid");
const md5 = require("md5");
      
const db = require("../db.js");

// login
module.exports.login = (request, response) => {
  response.render("./auth/auth.pug");
};

module.exports.postLogin = (request, response) => {
  var email = request.body.email;
  var password = request.body.password;
  
  var hashPassword = md5(password);
  var user = db
    .get("users")
    .find({ email: email })
    .value();
  
  if (!user) {
    response.render("./auth/auth.pug", {
      errors: ["User does not exist"],
      values: request.body
    });
    return;
  }
  
  if (user.password !== hashPassword) {
    response.render("./auth/auth.pug", {
      errors: ["Wrong password"],
      values: request.body
    });
    return;
  }
  
  response.cookie("userId", user.id);
  if(user.isAdmin === false) {
    response.redirect("/users");
  };
  
  response.redirect("/transactions");
};

// create user
module.exports.create = (request, response) => {
  response.render("./auth/create.auth.pug");
};

module.exports.postCreate = (request, response) => {
  var id = shortId.generate();
  db.get("users")
    .push({ 
      id: id, 
      userName: request.body.userName, 
      email: request.body.email, 
      password: md5(request.body.password),
      isAdmin: false,
      books: []
    })
    .write();
  response.redirect("/auth/login");
};
