/* eslint-disable no-param-reassign */
const { Strategy } = require('passport-discord');
const { clientID, clientSecret } = require('../../config').oauth.discord;
const User = require('../../db/models/user.model');
const registerUser = require('../../functions/registerUser');
const generateRandomBytes = require('../../functions/generateRandomBytes');

module.exports = (passport, refresh) => {
  const strategy = new Strategy(
    {
      clientID,
      clientSecret,
      callbackURL: '/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      profile.refreshToken = refreshToken;
      try {
        const user = await User.findOne({ where: { clientID: profile.id } });
        if (user) return done(null, user);
        const emailInUse = await User.findOne({ where: { email: profile.email } });
        if (emailInUse) return done({ error: 'Email is in use.' }, false);
        registerUser(
          profile.email,
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
