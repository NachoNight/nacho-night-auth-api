const { hashSync, compareSync } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const crypto = require('crypto');
const { environment, port, secret } = require('./config').server;
const User = require('./db/models/user.model');
const sendMail = require('./mail');
const cache = require('./cache');

class Controller {
  async register(req, res) {
    // Register an user
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) return res.status(403).json({ error: 'This email address is already in use.' });
      const newUser = await User.create({
        email: req.body.email,
        password: hashSync(req.body.password, 14),
      });
      console.log(`${newUser.email} has registered.`);
      const token = sign({ email: newUser.email }, secret, { expiresIn: '24h' });
      const response = `${
        environment === 'production' ? `https://${req.hostname}` : `http://localhost:${port}`
      }/verify-account/${token}`;
      sendMail(newUser.email, 'Verify your account!', response);
      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async login(req, res) {
    // Log an user in
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      if (user.banned) return res.status(403).json({ error: 'You have been banned.' });
      const correctPassword = await compareSync(req.body.password, user.password);
      if (!correctPassword) return res.status(403).json({ error: 'Incorrect Password.' });
      const payload = {
        id: user.id,
        email: user.email,
        verified: user.verified,
        created: user.createdAt,
      };
      const token = sign(payload, secret, {
        expiresIn: 3600,
      });
      return res.status(200).json({
        loggedIn: true,
        token: `Bearer ${token}`,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  verifyAccount(req, res) {
    // Verify the email verification token
    verify(req.params.token, secret, async (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token.' });
      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      if (user.banned) return res.status(403).json({ error: 'You have been banned.' });
      if (user.verified) {
        return res.status(300).json({ redirect: 'Your account has already been verified.' });
      }
      await user.update({ verified: true });
      return res.status(200).json(user);
    });
  }

  async current(req, res) {
    // Get the data of the user
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      if (user.banned) return res.status(403).json({ error: 'You have been banned.' });
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
      }/recover/${token}`;
      sendMail(user.email, 'Password Recovery', response);
      return res.status(200).json({ initiatedPasswordRecovery: true });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async recover(req, res) {
    // Recover the password
    try {
      const email = cache.get(req.params.token);
      if (email === undefined) return res.status(500).json({ error: 'An error has occured.' });
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      await user.update({ password: hashSync(req.body.password, 14) });
      cache.del(req.params.token);
      sendMail(
        user.email,
        'Password Changed Notice',
        'We want to let you know that your password has been changed.',
      );
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async changeEmail(req, res) {
    // Send out a token to verify an email change
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      if (user.banned) return res.status(403).json({ error: 'You have been banned.' });
      const token = await crypto.randomBytes(20).toString('hex');
      await cache.set(
        token,
        JSON.stringify({ currentEmail: user.email, newEmail: req.body.email }),
      );
      const response = `${
        environment === 'production' ? `https://${req.hostname}` : `http://localhost:${port}`
      }/verify-email-change/${token}`;
      sendMail(req.body.email, 'Email Change', response);
      return res.status(200).json({ initiatedEmailChange: true });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async verifyEmailChange(req, res) {
    // TODO: Discuss -> Render a view or redirect the user?
    // Verify the email change
    try {
      const data = JSON.parse(cache.get(req.params.token));
      if (data === {} || data === undefined) {
        return res.status(500).json({ error: 'An error has occured.' });
      }
      const user = await User.findOne({ where: { email: data.currentEmail } });
      if (!user) return res.status(404).json({ error: 'This email address is not in use.' });
      await user.update({ email: data.newEmail });
      if (user.banned) return res.status(403).json({ error: 'You have been banned.' });
      cache.del(req.params.token);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async changePassword(req, res) {
    // Change the password of an user
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: 'User not found.' });
      if (user.banned) return res.status(403).json({ error: 'You have been banned.' });
      await user.update({ password: hashSync(req.body.password, 14) });
      sendMail(
        user.email,
        'Password Changed Notice',
        'We want to let you know that your password has been changed.',
      );
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = new Controller();
