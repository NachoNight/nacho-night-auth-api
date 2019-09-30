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
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  return false;
};
