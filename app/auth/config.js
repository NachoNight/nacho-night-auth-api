const jwtStrategy = require('./strategies/jwt');
const googleStrategy = require('./strategies/google');
const discordStrategy = require('./strategies/discord');
// const twitterStrategy = require('./strategies/twitter');

module.exports = (passport, refresh) => {
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));
  jwtStrategy(passport);
  googleStrategy(passport, refresh);
  discordStrategy(passport, refresh);
  // twitterStrategy(passport);
};
