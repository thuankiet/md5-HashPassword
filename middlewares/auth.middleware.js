const db = require('../db');

module.exports.requireAuth = (request, response, next) => {
  if(!request.cookies.userId) {
    response.redirect('/auth/login');
    return;
  };
  
  var user = db.get('users').find({id: request.cookies.userId}).value();
  
  if(!user) {
    response.redirect('/auth/login');
    return;
  };
  
  response.locals.user = user
  next();
}