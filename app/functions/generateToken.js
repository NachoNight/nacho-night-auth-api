const { sign } = require('jsonwebtoken');
const { secret } = require('../config').server;

module.exports = (payload, expiresIn) => sign(payload, secret, { expiresIn });
