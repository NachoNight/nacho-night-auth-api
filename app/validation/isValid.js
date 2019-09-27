/*
  This helper function validates if the string is valid or not
  in the sense that is the object property 
  we are expecting to be a string, a string.
*/

module.exports = str => {
  if (str === "" || str === " " || str === null || str === undefined) {
    return false;
  }
  return true;
};
