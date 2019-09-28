const express = require('express');
const config = require('./config');
const applyMiddleware = require('./middleware');
const database = require('./db');

class Server {
  constructor() {
    this.app = express();
    this.init();
  }

  init() {
    // Apply middleware
    applyMiddleware(this.app);
    // Connect and sync the database
    database
      .authenticate()
      .then(() => console.log('Connection with the database established.'))
      .catch((err) => this.stop(err));
    database.sync({ logging: false });
  }

  start() {
    this.app.listen(config.port, (err) => {
      if (err) {
        this.stop(err);
      }
      console.log(
        `Server is running.\nhttp://localhost${config.port}/\nEnvironment: ${config.environment}`,
      );
    });
  }

  stop(err = false) {
    let exitCode = 0;
    if (err) {
      console.error(err);
      exitCode = 1;
    }
    console.log('Server stopped.');
    process.exit(exitCode);
  }
}

module.exports = new Server();
