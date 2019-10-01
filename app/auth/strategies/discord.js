const { Strategy } = require('passport-discord');
const { clientID, clientSecret } = require('../../config').oauth.discord;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const { randomBytes } = require('crypto');

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/discord/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ where: { clientID: profile.id } });
          if (user) {
            return done(null, user);
          }
          registerUser(profile.emails[0].value, randomBytes(32).toString('hex'), (err, user) => {
            if (err) {
              return done(err, false);
            }
            return done(null, user);
          });
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
