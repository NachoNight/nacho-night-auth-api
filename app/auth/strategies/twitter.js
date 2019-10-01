const { Strategy } = require('passport-twitter');
const { consumerKey, consumerSecret } = require('../../config').oauth.twitter;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const { randomBytes } = require('crypto');

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        consumerKey,
        consumerSecret,
        callbackURL: '/auth/twitter/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ where: { clientID: profile.id } });
          if (user) {
            return done(null, user);
          }
          registerUser(
            profile.emails[0].value,
            randomBytes(32).toString('hex'),
            (err, user) => {
              if (err) {
                return done(err, false);
              }
              return done(null, user);
            },
            profile.id,
          );
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
