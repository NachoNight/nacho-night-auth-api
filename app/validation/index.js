const validateRegistration = require('./functions/register');
const validateLogin = require('./functions/login');
const validateForgot = require('./functions/forgot');
const validateReset = require('./functions/reset');

class Validator {
  register(data) {
    return validateRegistration(data);
  }

  login(data) {
    return validateLogin(data);
  }

  forgot(data) {
    return validateForgot(data);
  }

  reset(data) {
    return validateReset(data);
  }
}

module.exports = new Validator();
