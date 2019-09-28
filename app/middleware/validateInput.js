const inputValidation = require('../validation');

module.exports = (req, res, next) => {
  const inputErrors = inputValidation[req.path.replace('/', '')](req.body);
  if (inputErrors) return res.status(500).json(inputErrors);
  next();
};
