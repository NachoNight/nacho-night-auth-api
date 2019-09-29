const validateRegistration = require('./functions/register');
const validateLogin = require('./functions/login');
const validateForgotPassword = require('./functions/forgot');
const validatePasswordRecovery = require('./functions/reset');

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
