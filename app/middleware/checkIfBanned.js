const User = require('../db/models/user.model');
const determineCredentials = require('../functions/determineCredentials');

module.exports = async (req, res, next) => {
  const credentials = determineCredentials(req, req.path.split('/')[1]);
  const user = await User.findOne({ where: credentials });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  if (user.banned) return res.status(403).json({ error: 'You are banned.' });
  next();
};
