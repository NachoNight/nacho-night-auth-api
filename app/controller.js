const User = require("./db/models/user.model");
const { hashSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { secret } = require("./config");

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
      const token = sign(payload, secret, {
        expiresIn: "24h"
      });
      return res.status(200).json({
        loggedIn: true,
        token: `Bearer ${token}`
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async current(req, res) {
    // Get the data of the user
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: "User not found." });
      const payload = {
        email: user.email,
        id: user.id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
        banned: user.banned
      };
      return res.status(200).json(payload);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  // edit(req, res) {
  //   // TODO: Implement this method once the mailing system is in place
  //   // Edit the account of the user
  // }
  delete(req, res) {
    // Delete the account
  }
}

module.exports = new Controller();
