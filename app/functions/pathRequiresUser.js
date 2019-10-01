/* eslint-disable operator-linebreak */
module.exports = (path) => {
  if (
    path === 'delete' ||
    path === 'current' ||
    path === 'change-password' ||
    path === 'change-email'
  ) {
    return true;
  }
  return false;
};
