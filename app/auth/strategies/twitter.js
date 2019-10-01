const { Strategy } = require('passport-twitter');
const { consumerKey, consumerSecret } = require('../../config').oauth.twitter;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const generateRandomBytes = require('../../functions/generateRandomBytes');

module.exports = (passport) => {
  const strategy = new Strategy(
    {
      consumerKey,
      consumerSecret,
      callbackURL: '/auth/twitter/callback',
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const user = await User.findOne({ where: { clientID: profile.id } });
        if (user) {
          return done(null, user);
        }
        registerUser(
          profile.id, // FIXME: Find a better solution than this
          generateRandomBytes(),
          (err, account) => {
            if (err) return done(err, false);
            return done(null, account);
          },
          profile.id,
        );
      } catch (error) {
        return done(error, false);
      }
    },
  );
  passport.use(strategy);
};
