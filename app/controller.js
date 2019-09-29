const { hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const crypto = require('crypto');
const { secret } = require('./config');
const User = require('./db/models/user.model');
const sendMail = require('./mail');
const cache = require('./cache');
const { environment, port } = require('./config');

class Controller {
  async register(req, res) {
    // Register an user
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) return res.status(403).json({ error: 'This email address is already in use.' });
      const newUser = await User.create({
        email: req.body.email,
        password: hashSync(req.body.password, 10),
      });
      console.log(`${newUser.email} has registered.`);
      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async login(req, res) {
    // Log an user in
    // TODO: Handle banned accounts
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      const correctPassword = await compareSync(req.body.password, user.password);
      if (!correctPassword) return res.status(403).json({ error: 'Incorrect Password.' });
      const payload = {
        id: user.id,
        email: user.email,
        verified: user.verified,
        created: user.createdAt,
      };
      const token = sign(payload, secret, {
        expiresIn: '24h',
      });
      return res.status(200).json({
        loggedIn: true,
        token: `Bearer ${token}`,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async current(req, res) {
    // Get the data of the user
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      const payload = {
        email: user.email,
        id: user.id,
        created: user.created,
        banned: user.banned,
      };
      return res.status(200).json(payload);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    // Delete the account
    try {
      await User.destroy({ where: { id: req.user.id } });
      return res.status(200).json({ deleted: true, timestamp: Date.now() });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async forgot(req, res) {
    // Send out an email with a token for password recovery
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      const token = await crypto.randomBytes(20).toString('hex');
      await cache.set(token, user.email);
      const response = `${
        environment === 'production' ? `https://${req.hostname}` : `http://localhost:${port}`
      }/reset/${token}`;
      await sendMail(user.email, 'Password Reset', response);
      return res.status(200).json({ initiatedPasswordRecovery: true });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async reset(req, res) {
    // Reset passwords
    try {
      const email = cache.get(req.params.token);
      if (email === undefined) return res.status(500).json({ error: 'An error has occured.' });
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      await user.update({ password: hashSync(req.body.password, 10) });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async changeEmail(req, res) {
    // Send out a token to verify an email change
    try {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      const token = await crypto.randomBytes(20).toString('hex');
      await cache.set(
        token,
        JSON.stringify({ currentEmail: user.email, newEmail: req.body.email }),
      );
      const response = `${
        environment === 'production' ? `https://${req.hostname}` : `http://localhost:${port}`
      }/verify/${token}`;
      await sendMail(user.email, 'Email Change', response);
      return res.status(200).json({ initiatedEmailChange: true });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async verifyEmail(req, res) {
    try {
      const data = JSON.parse(cache.get(req.params.token));
      if (data === {} || data === undefined) {
        return res.status(500).json({ error: 'An error has occured.' });
      }
      const user = await User.findOne({ where: { email: data.currentEmail } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      await user.update({ email: data.newEmail });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = new Controller();
