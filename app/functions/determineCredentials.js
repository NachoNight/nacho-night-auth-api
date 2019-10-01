module.exports = (req, path) => {
  let emailOrID = {
    email: req.body.email,
  };
  if (
    path === 'delete' ||
    path === 'current' ||
    path === 'change-password' ||
    path === 'change-email'
  ) {
    emailOrID = { id: req.user.id };
  }
  return emailOrID;
};
