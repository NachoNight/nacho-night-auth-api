const { Strategy, ExtractJwt } = require('passport-jwt');
const { secret } = require('../../config').server;
const User = require('../../db/models/user.model');

module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
      },
      async (payload, done) => {
        try {
          const user = await User.findOne({ where: { id: payload.id } });
          if (!user) return done('User not found.', false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
