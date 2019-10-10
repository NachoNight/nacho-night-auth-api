const { hashSync, compareSync } = require('bcryptjs');
const { verify } = require('jsonwebtoken');
const { secret } = require('./config').server;
const User = require('./db/models/user.model');
const EmailAddress = require('./db/models/email-address.model');
const sendMail = require('./mail');
const cache = require('./cache');
const registerUser = require('./functions/registerUser');
const generateToken = require('./functions/generateToken');
const generateRandomBytes = require('./functions/generateRandomBytes');

class Controller {
  register(req, res) {
    // Register an user
    registerUser(req.body.email, req.body.password, (err, user) => {
      if (err) return res.status(500).json(err);
      const token = generateToken({ email: user.email }, '24h');
      sendMail(
        user.email,
        'Verify your account!',
        `${req.hostname}/verify-account/${token}`,
      );
      return res.status(200).json(user);
    });
  }

  async login(req, res) {
    // Log an user in
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      const correctPassword = compareSync(req.body.password, user.password);
      if (!correctPassword)
        return res.status(403).json({ error: 'Incorrect Password.' });
      const { id, email, verified, banned, clientID, created } = user;
      const payload = {
        id,
        email,
        verified,
        banned,
        clientID,
        created,
      };
      const token = generateToken(payload, 3600);
      return res.status(200).json({
        loggedIn: true,
        token: `Bearer ${token}`,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async sendVerification(req, res) {
    try {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (user.verified)
        return res
          .status(300)
          .json({ redirect: 'Your account has already been verified.' });
      const token = generateToken({ email: user.email }, '24h');
      sendMail(
        user.email,
        'Verify your account!',
        `${req.hostname}/verify-account/${token}`,
      );
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'An error has occured.' });
    }
  }

  verifyAccount(req, res) {
    // Verify the email verification token
    verify(req.params.token, secret, async (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token.' });
      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user)
        return res
          .status(404)
          .json({ error: 'This email address is not in use.' });
      if (user.banned)
        return res.status(403).json({ error: 'You have been banned.' });
      if (user.verified) {
        return res
          .status(300)
          .json({ redirect: 'Your account has already been verified.' });
      }
      await user.update({ verified: true });
      return res.status(200).json(user);
    });
  }

  current(req, res) {
    // Get the data of the user
    const { id, email, verified, banned, clientID, created } = req.user;
    const payload = {
      id,
      email,
      verified,
      banned,
      clientID,
      created,
    };
    return res.status(200).json(payload);
  }

  async deleteUser(req, res) {
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
      const token = generateRandomBytes();
      cache.set(token, user.email);
      sendMail(
        user.email,
        'Password Recovery',
        `${req.hostname}/recover/${token}`,
      );
      return res.status(200).json({ initiatedPasswordRecovery: true });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async recover(req, res) {
    // Recover the password
    try {
      const email = cache.get(req.params.token);
      if (email === undefined)
        return res.status(500).json({ error: 'An error has occured.' });
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res
          .status(404)
          .json({ error: 'This email address is not in use.' });
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
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user)
        return res.status(403).json({ error: 'The email address is in use.' });
      const token = generateRandomBytes();
      cache.set(
        token,
        JSON.stringify({
          currentEmail: req.user.email,
          newEmail: req.body.email,
        }),
      );
      sendMail(
        req.body.email,
        'Email Change',
        `${req.hostname}/verify-email-change/${token}`,
      );
      return res.status(200).json({ initiatedEmailChange: true });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async verifyEmailChange(req, res) {
    // Verify the email change
    try {
      const data = JSON.parse(cache.get(req.params.token));
      if (data === {} || data === undefined) {
        return res.status(500).json({ error: 'An error has occured.' });
      }
      const user = await User.findOne({ where: { email: data.currentEmail } });
      if (!user)
        return res
          .status(404)
          .json({ error: 'This email address is not in use.' });
      if (user.banned)
        return res.status(403).json({ error: 'You have been banned.' });
      await user.update({ email: data.newEmail });
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

  async addAddress(req, res) {
    // Add an email address to the database.
    try {
      const entry = await EmailAddress.findOne({
        where: { email: req.body.email },
      });
      if (entry)
        return res
          .status(403)
          .json({ error: 'Email already exists within our collection.' });
      await EmailAddress.create({ email: req.body.email });
      return res.status(200).json({ action: 'created' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async removeAddress(req, res) {
    // Remove an email from our collection.
    try {
      await EmailAddress.destroy({ where: { email: req.body.email } });
      return res.status(200).json({ action: 'deleted' });
    } catch (error) {
      console.log('Error', error);
      return res.status(500).json(error);
    }
  }

  generateJWTFromOAuth(req, res) {
    const { id, email, verified, banned, clientID, created } = req.user;
    const payload = {
      id,
      email,
      verified,
      banned,
      clientID,
      created,
    };
    const token = generateToken(payload, 3600);
    return res.status(200).json({
      loggedIn: true,
      token: `Bearer ${token}`,
    });
  }
}

module.exports = new Controller();
