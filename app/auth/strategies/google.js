const { OAuth2Strategy } = require('passport-google-oauth');
const { clientID, clientSecret } = require('../../config').oauth.google;

module.exports = (passport) => {
  passport.use(
    new OAuth2Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: '/auth/google/callback',
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
