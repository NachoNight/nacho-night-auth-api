const express = require('express');
const config = require('./config');
const applyMiddleware = require('./middleware');
const authSystem = require('./auth');
const initRouter = require('./router');
const { authenticate, sync } = require('./db');

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
    authenticate()
      .then(() => console.log('Connection with the database established.'))
      .catch((err) => this.stop(err));
    sync({ logging: false });
  }

  start() {
    this.app.listen(config.server.port, (err) => {
      if (err) {
        this.stop(err);
      }
      console.log(
        `Server is running.\nhttp://localhost:${config.server.port}/\nEnvironment: ${config.server.environment}`,
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
