const { sign } = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = payload => {
  sign(payload, secret, { expiresIn: "24h" }, (_, token) => token);
};
