const { hashSync } = require('bcrypt');
const User = require('../db/models/user.model');

module.exports = async (email, password, callback, clientID = false) => {
  try {
    const credentials = {
      email,
      password: hashSync(password, 14),
    };
    if (clientID) credentials.clientID = clientID;
    const newUser = await User.create(credentials);
    callback(null, newUser);
  } catch (error) {
    callback(error, false);
  }
};
