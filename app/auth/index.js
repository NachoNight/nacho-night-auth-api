/*
  The exported function takes in the app itself as the argument
  and initializes the authentication system.
*/
const passport = require('passport');
const authConfig = require('../auth/config');

module.exports = (app) => {
  app.use(passport.initialize());
  authConfig(passport);
};
