const app = require("express")();
const config = require("./config");
const applyMiddleware = require("./middleware");

applyMiddleware(app);

app.listen(config.port, err =>
  err
    ? process.exit(1)
    : console.log(
        `Server running!\nhttp://localhost:${config.port}/\nEnvironment: ${config.environment}`
      )
);
