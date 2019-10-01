/*
  The exported function takes in the app itself as the argument
  and initializes the authentication system.
*/
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const authConfig = require('../auth/config');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  authConfig(passport, refresh);
};
