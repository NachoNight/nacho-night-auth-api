const { isEmpty } = require('validator');
const isValid = require('./isValid');

module.exports = (data) => {
  const errors = {};
  if (!isValid(data.password)) {
    errors.passwordInputInvalid = 'The provided input for the password is not valid.';
  }
  if (isEmpty(data.password)) {
    errors.passwordEmpty = 'Please provide your password.';
  }
  if (data.password.length <= 8) {
    errors.passwordLength = 'Your password should be more than 8 characters long.';
  }
  if (data.password !== data.confirmPassword) {
    errors.passwordsNotMatching = 'The passwords are not matching.';
  }
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return false;
};
