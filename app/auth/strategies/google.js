const { OAuth2Strategy } = require('passport-google-oauth');
const { clientID, clientSecret } = require('../../config').oauth.google;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const { randomBytes } = require('crypto');

module.exports = (passport) => {
  passport.use(
    new OAuth2Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/google/callback',
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
