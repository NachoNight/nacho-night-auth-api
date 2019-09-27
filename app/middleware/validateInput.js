const inputValidation = require("../validation");

module.exports = (req, res, next) => {
  const inputErrors = inputValidation[req.path.replace("/", "")](req.body);
  inputErrors ? res.status(500).json(errors) : next();
};
