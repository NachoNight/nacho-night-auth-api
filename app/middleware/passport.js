const { Strategy, ExtractJwt } = require('passport-jwt');
const { secret } = require('../config');
const User = require('../db/models/user.model');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

module.exports = (passport) => {
  passport.use(
    // eslint-disable-next-line consistent-return
    new Strategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ where: { id: jwtPayload.id } });
        if (!user) return done('User not found.', false);
        return done(null, user);
      } catch (error) {
        done(error, false);
      }
    }),
  );
};
