/*
  List routes in the exported function
  The controller methods handle the logic
  TODO: Write the necessary validation middleware for the routes
*/
const controller = require("./controller");
const validateInput = require("./middleware/validateInput");
const passport = require("passport");

module.exports = app => {
  app.get("/", (req, res) => res.send("NachoNight Authentication API"));
  app.post("/register", validateInput, (req, res) =>
    controller.register(req, res)
  );
  app.post("/login", (req, res) => controller.login(req, res));
  app.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => controller.current(req, res)
  );
  // app.put("/edit", (req, res) => controller.edit(req, res));
  app.delete("/delete", (req, res) => controller.delete(req, res));
};
