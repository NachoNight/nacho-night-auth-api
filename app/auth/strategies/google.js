/* eslint-disable no-param-reassign */
const { OAuth2Strategy } = require('passport-google-oauth');
const { clientID, clientSecret } = require('../../config').oauth.google;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const generateRandomBytes = require('../../functions/generateRandomBytes');

module.exports = (passport, refresh) => {
  const strategy = new OAuth2Strategy(
    {
      clientID,
      clientSecret,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      profile.refreshToken = refreshToken;
      try {
        const user = await User.findOne({ where: { clientID: profile.id } });
        if (user) return done(null, user);
        const emailInUse = await User.findOne({ where: { email: profile.emails[0].value } });
        if (emailInUse) return done({ error: 'Email is in use.' }, false);
        registerUser(
          profile.emails[0].value,
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
  refresh.use(strategy);
};
