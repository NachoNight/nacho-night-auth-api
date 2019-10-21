/**
 * The exported function takes in the app itself as the argument
 * and applies all the listed middleware to it.
 * Import and apply the middleware within the function.
 */
const { json, urlencoded } = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const logger = require('./logger');
const { secret, environment } = require('../config').server;

module.exports = (app) => {
  const sessionConfig = {
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600 },
  };
  if (environment !== 'development') sessionConfig.cookie.secure = true;
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(session(sessionConfig));
  app.use(cors());
  logger(app);
};
