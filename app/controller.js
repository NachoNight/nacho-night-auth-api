const User = require("./db/models/user.model");
const generateUserToken = require("./utils/generateUserToken");
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
  async login(req, res) {
    // Log an user in
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user)
        return res
          .status(404)
          .json({ error: "This email address is not in use." });
      const payload = {
        id: user.id,
        email: user.email,
        verified: user.verified,
        createdAt: user.createdAt
      };
      return res
        .status(200)
        .json({
          loggedIn: true,
          token: `Bearer ${generateUserToken(payload)}`
        });
    } catch (error) {
      return res.status(500).json(error);
    }
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
