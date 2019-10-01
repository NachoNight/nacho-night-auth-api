const { secret } = require('../config').server;
const { sign } = require('jsonwebtoken');

module.exports = (payload, expiresIn) => {
  return sign(payload, secret, { expiresIn });
};
