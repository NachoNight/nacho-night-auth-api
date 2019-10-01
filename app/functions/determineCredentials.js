module.exports = (req) => {
  const path = req.path.split('/')[1];
  const paths = ['current', 'delete', 'change-email', 'change-password'];
  const match = paths.find((v) => v === path);
  if (match === 'change-email') return { email: req.user.email };
  if (match) return { id: req.user.id };
  return { email: req.body.email };
};
