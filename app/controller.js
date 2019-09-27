const User = require("./db/models/user.model");
const { hashSync } = require("bcrypt");

class Controller {
  async register(req, res) {
    // Register an user
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user)
        return res
          .status(403)
          .json({ error: "This email address is already in use." });
      const newUser = await User.create({
        email: req.body.email,
        password: hashSync(req.body.password, 10)
      });
      console.log(`${newUser.email} has registered.`);
      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  login(req, res) {
    // Log an user in
  }
  current(req, res) {
    // Get the data of the user
  }
  edit(req, res) {
    // Edit the account of the user
  }
  delete(req, res) {
    // Delete the account
  }
}

module.exports = new Controller();
