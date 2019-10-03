const addStrategy = require('../functions/addStrategy');

module.exports = (passport) => {
  // Currently set up only to transfer names, but we can pipe other metadata from here
  const strategies = [{ name: 'jwt' }, { name: 'google' }, { name: 'discord' }];
  strategies.forEach((s) => addStrategy(passport, s));
  // Serialization
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));
};
