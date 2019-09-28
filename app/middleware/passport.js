const { Strategy, ExtractJwt } = require("passport-jwt");
const { secret } = require("../config");
const User = require("../db/models/user.model");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

module.exports = passport =>
  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ where: { id: jwt_payload.id } });
        user ? done(null, user) : done("User not found", false);
      } catch (error) {
        done(error, false);
      }
    })
  );
