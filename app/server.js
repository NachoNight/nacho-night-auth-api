const express = require('express');
const { port, environment } = require('./config').server;
const applyMiddleware = require('./middleware');
const authSystem = require('./auth');
const initRouter = require('./router');
const database = require('./db');

class Server {
  constructor() {
    this.app = express();
    this.init();
  }

  init() {
    // Apply middleware
    applyMiddleware(this.app);
    // Start authentication system
    authSystem(this.app);
    // Initialize router
    initRouter(this.app);
    // Connect and sync the database
    database
      .authenticate()
      .then(() => console.log('Connection with the database established.'))
      .catch((err) => this.stop(err));
    database.sync({ logging: false });
  }

  start() {
    this.app.listen(port, (err) => {
      if (err) {
        this.stop(err);
      }
      console.log(
        `Server is running.\nhttp://localhost:${port}/\nEnvironment: ${environment}`,
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
