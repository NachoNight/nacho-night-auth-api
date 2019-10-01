module.exports = (path) => {
  const paths = [
    'login',
    'delete',
    'current',
    'change-password',
    'change-email',
    'forgot',
    'change-password',
  ];
  return paths.find((v) => v === path);
};
