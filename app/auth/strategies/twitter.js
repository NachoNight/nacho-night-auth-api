const { Strategy } = require('passport-twitter');
const { consumerKey, consumerSecret } = require('../../config').oauth.twitter;

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        consumerKey,
        consumerSecret,
        callbackURL: '/auth/twitter/callback',
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
