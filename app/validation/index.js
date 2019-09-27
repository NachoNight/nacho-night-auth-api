const { isEmpty, isLength, isEmail } = require("validator");
const isValid = require("./isValid");

class Validator {
  constructor() {
    this.errors = {};
  }
  register(data) {
    // Email validation
    if (!isValid(data.email))
      this.errors.emailInvalidInput =
        "The provided input for the email address is not valid.";
    if (isEmpty(data.email))
      this.errors.emailEmpty = "Please provide your email address.";
    if (!isEmail(data.email))
      this.errors.emailInvalid = "Please provide a valid email address.";
    // Password validation
    if (!isValid(data.password))
      this.errors.passwordInputInvalid =
        "The provided input for the password is not valid.";
    if (isEmpty(data.password))
      this.errors.passwordEmpty = "Please provide your password.";
    if (!isLength(data.password, { min: 8, max: 32 }))
      this.errors.passwordLength =
        "Please provide password between 8 and 32 characters long.";
    if (data.password !== data.confirmPasword)
      this.errors.passwordsNotMatching = "The passwords are not matching.";
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
