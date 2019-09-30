const { isEmpty, isEmail } = require('validator');
const isValid = require('./isValid');

module.exports = (data) => {
  const errors = {};
  if (!isValid(data.email)) {
    errors.emailInvalidInput = 'The provided input for the email address is not valid.';
  }
  if (isEmpty(data.email)) {
    errors.emailEmpty = 'Please provide your email address.';
  }
  if (!isEmail(data.email)) {
    errors.emailInvalid = 'Please provide a valid email address.';
  }
  if (!isValid(data.password)) {
    errors.passwordInputInvalid = 'The provided input for the password is not valid.';
  }
  if (isEmpty(data.password)) {
    errors.passwordEmpty = 'Please provide your password.';
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return false;
};
