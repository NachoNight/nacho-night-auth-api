const validateRegistration = require('./methods/register');
const validateLogin = require('./methods/login');
const validateForgotPassword = require('./methods/forgot');
const validatePasswordRecovery = require('./methods/reset');

class Validator {
  register(data) {
    return validateRegistration(data);
  }

  login(data) {
    return validateLogin(data);
  }

  forgot(data) {
    return validateForgotPassword(data);
  }

  recover(data) {
    return validatePasswordRecovery(data);
  }
}

module.exports = new Validator();
