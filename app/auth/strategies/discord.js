const { Strategy } = require('passport-discord');
const { clientID, clientSecret } = require('../../config').oauth.discord;

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/discord/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          console.log(profile.id);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
