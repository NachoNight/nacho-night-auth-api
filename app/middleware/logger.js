/*
  Set up an access logging system using Morgan.
  Create a write stream using the file system module
  to write to a log file.

  The function also takes in the app as an argument,
  which will be passed in from the function in the
  index.js file contained in the same folder
*/
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const folderPath = path.resolve(__dirname, '../logs');
  // Create the logs folder if it does not exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  const stream = fs.createWriteStream(path.join(folderPath, 'access.log'), {
    flags: 'a',
  });
  app.use(
    morgan('combined', {
      stream,
    }),
  );
};
