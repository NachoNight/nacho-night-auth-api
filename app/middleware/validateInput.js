const inputValidation = require('../validation');

module.exports = (req, res, next) => {
  let path = req.path.split('/')[1];
  // All three endpoints noted in the if statement below use the same validation
  if (path === 'add-address' || path === 'remove-address') path = 'forgot';
  const inputErrors = inputValidation[path](req.body);
  if (inputErrors) return res.status(500).json(inputErrors);
  next();
};
