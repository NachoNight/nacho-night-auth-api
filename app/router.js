/**
 * List routes in the exported function
 * The controller methods handle the logic
 */
const passport = require('passport');
const {
  changeEmail,
  changePassword,
  current,
  deleteUser,
  forgot,
  login,
  recover,
  register,
  verifyAccount,
  verifyEmailChange,
} = require('./controller');
const validateInput = require('./middleware/validateInput');
const checkForUser = require('./middleware/checkForUser');
const checkIfBanned = require('./middleware/checkIfBanned');

module.exports = (app) => {
  const opts = {
    google: {
      session: false,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    },
    callback: {
      failureRedirect: '/login',
      successRedirect: '/',
    },
  };
  app.get('/', (_, res) => res.send('NachoNight Authentication API'));
  app.post('/register', checkForUser, validateInput, (req, res) => register(req, res));
  app.get('/verify-account/:token', (req, res) => verifyAccount(req, res));
  app.post('/login', checkForUser, checkIfBanned, validateInput, (req, res) => login(req, res));
  app.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    checkIfBanned,
    (req, res) => current(req, res),
  );
  app.delete(
    '/delete',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    (req, res) => {
      deleteUser(req, res);
    },
  );
  app.patch('/forgot', validateInput, (req, res) => forgot(req, res));
  app.patch('/recover/:token', validateInput, (req, res) => recover(req, res));
  app.put(
    '/change-email',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    checkIfBanned,
    (req, res) => changeEmail(req, res),
  );
  app.get('/verify-email-change/:token', (req, res) => verifyEmailChange(req, res));
  app.put(
    '/change-password',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    checkIfBanned,
    (req, res) => changePassword(req, res),
  );
  // OAuth
  app.get('/auth/google', passport.authenticate('google', opts.google));
  app.get('/auth/google/callback', passport.authenticate('google', opts.callback));
  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord', opts.callback));
  // app.get('/auth/twitter', passport.authenticate('twitter'));
  // app.get('/auth/twitter/callback', passport.authenticate('twitter', opts.callback));
  // app.get('/auth/facebook', passport.authenticate('facebook'));
  // app.get('/auth/facebook/callback', passport.authenticate('facebook', opts.callback));
};
