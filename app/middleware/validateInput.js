const inputValidation = require('../validation');

module.exports = (req, res, next) => {
  const path = req.path.split('/')[1];
  const inputErrors = inputValidation[path](req.body);
  if (inputErrors) return res.status(500).json(inputErrors);
  next();
};
