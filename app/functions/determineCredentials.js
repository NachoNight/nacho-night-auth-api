const pathRequiresUser = require('../functions/pathRequiresUser');

module.exports = (req, path) => {
  let emailOrID = {
    email: req.body.email,
  };
  if (pathRequiresUser(path)) {
    emailOrID = { id: req.user.id };
  }
  return emailOrID;
};
