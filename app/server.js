const config = require("./config");
const applyMiddleware = require("./middleware");

class Server {
  constructor() {
    this.app = require("express")();
    applyMiddleware(this.app);
  }
  start() {
    this.app.listen(config.port, err =>
      err
        ? this.stop(err)
        : console.log(
            `Server running!\nhttp://localhost:${config.port}/\nEnvironment: ${config.environment}`
          )
    );
  }
  stop(err = false) {
    let exitCode = 0;
    if (err) {
      console.error(err);
      exitCode = 1;
    }
    console.log("Server stopped.");
    process.exit(exitCode);
  }
}

module.exports = new Server();
