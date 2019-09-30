const { Strategy } = require('passport-facebook');
const { clientID, clientSecret } = require('../../config').oauth.facebook;

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/facebook/callback',
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
