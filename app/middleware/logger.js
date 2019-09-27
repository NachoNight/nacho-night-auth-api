/*
  Set up an access logging system using Morgan.
  Create a write stream using the file system module
  to write to a log file.

  The function also takes in the app as an argument,
  which will be passed in from the function in the
  index.js file contained in the same folder
*/
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

module.exports = app =>
  app.use(
    morgan("combined", {
      stream: fs.createWriteStream(path.resolve(__dirname, "../logs"))
    })
  );
