/* eslint-disable operator-linebreak */
const User = require('../db/models/user.model');
const determineCredentials = require('../functions/determineCredentials');
const pathRequiresUser = require('../functions/pathRequiresUser');

module.exports = async (req, res, next) => {
  try {
    // Stuff
    const path = req.path.split('/')[1];
    const credentials = determineCredentials(req, path);
    const user = await User.findOne({ where: credentials });
    // Functions
    const checkIfAnUserExists = () => {
      if (user) return res.status(403).json({ error: 'A user already exists.' });
    };
    const checkIfAnUserDoesNotExist = () => {
      if (!user) return res.status(404).json({ error: 'User not found.' });
    };
    // Conduct check
    /*
    If we are hitting an endpoint
    where we need the check if there
    is a user, check the opposite.

    Since if there is no user, the return
    statement will fire off an an error
    message will be sent out.
  */
    if (pathRequiresUser(path)) {
      checkIfAnUserDoesNotExist();
    } else {
      checkIfAnUserExists();
    }
    /*
    If additional request mutations
    have to be added, do them before
    the next() call.
  */
    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};
