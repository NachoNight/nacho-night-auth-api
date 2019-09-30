// TODO: Implement user creation in the OAuth strategies before uncommenting.
const jwtStrategy = require('./strategies/jwt');
// const googleStrategy = require('./strategies/google');
// const facebookStrategy = require('./strategies/facebook');
// const twitterStrategy = require('./strategies/twitter');
// const discordStrategy = require('./strategies/discord');

module.exports = (passport) => {
  jwtStrategy(passport);
  // googleStrategy(passport);
  // facebookStrategy(passport);
  // twitterStrategy(passport);
  // discordStrategy(passport);
};
