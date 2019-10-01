const jwtStrategy = require('./strategies/jwt');
const googleStrategy = require('./strategies/google');
const twitterStrategy = require('./strategies/twitter');
const discordStrategy = require('./strategies/discord');
// const facebookStrategy = require('./strategies/facebook');

module.exports = (passport, refresh) => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));
  jwtStrategy(passport);
  googleStrategy(passport, refresh);
  twitterStrategy(passport);
  discordStrategy(passport, refresh);
  // facebookStrategy(passport);
};
