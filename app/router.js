/*
  List routes in the exported function
  The controller methods handle the logic
*/
const passport = require('passport');
const controller = require('./controller');
const validateInput = require('./middleware/validateInput');
const checkForUser = require('./middleware/checkForUser');
const checkIfBanned = require('./middleware/checkIfBanned');

const oauthConfig = {
  failureRedirect: '/login',
  successRedirect: '/',
  session: false,
};

module.exports = (app) => {
  app.get('/', (_, res) => {
    res.send('NachoNight Authentication API');
  });
  app.post('/register', checkForUser, validateInput, (req, res) => {
    controller.register(req, res);
  });
  app.get('/verify-account/:token', (req, res) => {
    controller.verifyAccount(req, res);
  });
  app.post('/login', checkForUser, checkIfBanned, validateInput, (req, res) => {
    controller.login(req, res);
  });
  app.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    checkIfBanned,
    (req, res) => {
      controller.current(req, res);
    },
  );
  app.delete(
    '/delete',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    (req, res) => {
      controller.delete(req, res);
    },
  );
  app.patch('/forgot', validateInput, (req, res) => {
    controller.forgot(req, res);
  });
  app.patch('/recover/:token', validateInput, (req, res) => {
    controller.recover(req, res);
  });
  app.put(
    '/change-email',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    checkIfBanned,
    (req, res) => {
      controller.changeEmail(req, res);
    },
  );
  app.get('/verify-email-change/:token', (req, res) => {
    controller.verifyEmailChange(req, res);
  });
  app.put(
    '/change-password',
    passport.authenticate('jwt', { session: false }),
    checkForUser,
    checkIfBanned,
    (req, res) => {
      controller.changePassword(req, res);
    },
  );
  // OAuth
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      session: false,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    }),
  );
  app.get('/auth/google/callback', passport.authenticate('google', oauthConfig));
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', oauthConfig));
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', oauthConfig));
  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord', oauthConfig));
};
