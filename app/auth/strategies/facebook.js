const { Strategy } = require('passport-facebook');
const { clientID, clientSecret } = require('../../config').oauth.facebook;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const { randomBytes } = require('crypto');

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/facebook/callback',
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
