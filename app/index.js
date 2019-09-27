const app = require("express")();
const config = require("./config");

app.listen(config.port, err =>
  err
    ? process.exit(1)
    : console.log(
        `Server running!\nhttp://localhost:${config.port}/\nEnvironment: ${config.environment}`
      )
);
