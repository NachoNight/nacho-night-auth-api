const addStrategy = require('../functions/addStrategy');
const User = require('../db/models/user.model.js');

module.exports = (passport) => {
  // Currently set up only to transfer names, but we can pipe other metadata from here
  const strategies = [{ name: 'jwt' }, { name: 'google' }, { name: 'discord' }];
  strategies.forEach((s) => addStrategy(passport, s));
  // Serialization
  passport.serializeUser(({ id }, done) => done(null, id));
  passport.deserializeUser(({ id }, done) => {
    User.findOne({ where: id })
      .then((user) => {
        if (!user) return done('User not found', false);
        return done(null, user);
      })
      .catch((err) => done(err, false));
  });
};
