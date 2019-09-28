const { isEmpty, isEmail } = require('validator');
const isValid = require('./isValid');

class Validator {
  constructor() {
    this.errors = {};
  }

  register(data) {
    this.resetErrors();
    // Email validation
    if (!isValid(data.email)) {
      this.errors.emailInvalidInput = 'The provided input for the email address is not valid.';
    }
    if (isEmpty(data.email)) {
      this.errors.emailEmpty = 'Please provide your email address.';
    }
    if (!isEmail(data.email)) {
      this.errors.emailInvalid = 'Please provide a valid email address.';
    }
    // Password validation
    if (!isValid(data.password)) {
      this.errors.passwordInputInvalid = 'The provided input for the password is not valid.';
    }
    if (isEmpty(data.password)) {
      this.errors.passwordEmpty = 'Please provide your password.';
    }
    if (data.password.length <= 8) {
      this.errors.passwordLength = 'Your password should be more than 8 characters long.';
    }
    if (data.password !== data.confirmPassword) {
      this.errors.passwordsNotMatching = 'The passwords are not matching.';
    }
    return this.checkForErrors();
  }

  login(data) {
    this.resetErrors();
    // Check if the data provided is not empty
    if (!isValid(data.email)) {
      this.errors.emailInvalidInput = 'The provided input for the email address is not valid.';
    }
    if (isEmpty(data.email)) {
      this.errors.emailEmpty = 'Please provide your email address.';
    }
    if (!isEmail(data.email)) {
      this.errors.emailInvalid = 'Please provide a valid email address.';
    }
    if (!isValid(data.password)) {
      this.errors.passwordInputInvalid = 'The provided input for the password is not valid.';
    }
    if (isEmpty(data.password)) {
      this.errors.passwordEmpty = 'Please provide your password.';
    }
    return this.checkForErrors();
  }

  forgot(data) {
    this.resetErrors();
    if (!isValid(data.email)) {
      this.errors.emailInvalidInput = 'The provided input for the email address is not valid.';
    }
    if (isEmpty(data.email)) {
      this.errors.emailEmpty = 'Please provide your email address.';
    }
    if (!isEmail(data.email)) {
      this.errors.emailInvalid = 'Please provide a valid email address.';
    }
    return this.checkForErrors();
  }

  reset(data) {
    this.resetErrors();
    if (!isValid(data.password)) {
      this.errors.passwordInputInvalid = 'The provided input for the password is not valid.';
    }
    if (isEmpty(data.password)) {
      this.errors.passwordEmpty = 'Please provide your password.';
    }
    if (data.password.length <= 8) {
      this.errors.passwordLength = 'Your password should be more than 8 characters long.';
    }
    if (data.password !== data.confirmPassword) {
      this.errors.passwordsNotMatching = 'The passwords are not matching.';
    }
    return this.checkForErrors();
  }

  resetErrors() {
    this.errors = {};
  }

  checkForErrors() {
    if (Object.keys(this.errors).length > 0) {
      return this.errors;
    }
    return false;
  }
}

module.exports = new Validator();
