/**
 * List routes in the exported function
 * The controller methods handle the logic
 */
const passport = require('passport');
const validateInput = require('./middleware/validateInput');
const checkForUser = require('./middleware/checkForUser');
const checkIfBanned = require('./middleware/checkIfBanned');

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
  sendVerification,
  addAddress,
  removeAddress,
  generateJWTFromOAuth,
  findUserById,
} = require('./controller');

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
    },
    passport: passport.authenticate('jwt', { session: false }),
  };

  app.get('/', (_, res) => {
    res.send('NachoNight Authentication API');
  });
  app.post('/register', checkForUser, validateInput, (req, res) =>
    register(req, res),
  );
  app.get('/send-verification', opts.passport, checkForUser, (req, res) =>
    sendVerification(req, res),
  );
  app.get('/verify-account/:token', (req, res) => verifyAccount(req, res));
  app.post('/login', checkForUser, checkIfBanned, validateInput, (req, res) =>
    login(req, res),
  );
  app.get('/current', opts.passport, checkForUser, checkIfBanned, (req, res) =>
    current(req, res),
  );
  app.delete('/delete', opts.passport, checkForUser, (req, res) => {
    deleteUser(req, res);
  });
  app.patch('/forgot', validateInput, (req, res) => forgot(req, res));
  app.patch('/recover/:token', validateInput, (req, res) => recover(req, res));
  app.put(
    '/change-email',
    opts.passport,
    checkForUser,
    checkIfBanned,
    (req, res) => changeEmail(req, res),
  );
  app.get('/verify-email-change/:token', (req, res) =>
    verifyEmailChange(req, res),
  );
  app.put(
    '/change-password',
    opts.passport,
    checkForUser,
    checkIfBanned,
    (req, res) => changePassword(req, res),
  );
  // OAuth
  app.get('/auth/google', passport.authenticate('google', opts.google));
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', opts.callback),
    (req, res) => generateJWTFromOAuth(req, res),
  );
  app.get('/auth/discord', passport.authenticate('discord'));
  app.get(
    '/auth/discord/callback',
    passport.authenticate('discord', opts.callback),
    (req, res) => generateJWTFromOAuth(req, res),
  );
  /** Disabled OAuth routes:
   * app.get('/auth/twitter', passport.authenticate('twitter'));
   * app.get('/auth/twitter/callback', passport.authenticate('twitter', opts.callback));
   */
  // Email address collection
  app.post('/add-address', opts.passport, validateInput, (req, res) =>
    addAddress(req, res),
  );
  app.delete('/remove-address', opts.passport, validateInput, (req, res) =>
    removeAddress(req, res),
  );
  // Find user by ID - Used for authorization middleware for other services
  app.get('/find/:id', (req, res) => findUserById(req, res));
};
