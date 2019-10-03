/* eslint-disable indent */
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy: DiscordStrategy } = require('passport-discord');
const refresh = require('passport-oauth2-refresh');
const { secret } = require('../config').server;
const { google, discord } = require('../config').oauth;
const registerUser = require('./registerUser');
const generateRandomBytes = require('./generateRandomBytes');
const User = require('../db/models/user.model');

const options = {
  jwt: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    callback: async (payload, done) => {
      try {
        const user = await User.findOne({ where: { id: payload.id } });
        if (!user) return done('User not found.', false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  },
  google: {
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: google.callbackURL,
  },
  discord: {
    clientID: discord.clientID,
    clientSecret: discord.clientSecret,
    callbackURL: discord.callbackURL,
    scope: ['identify', 'email'],
  },
};

module.exports = (passport, { name }) => {
  let InstanceConstructor;
  switch (name) {
    case 'jwt':
      InstanceConstructor = JwtStrategy;
      break;
    case 'google':
      InstanceConstructor = GoogleStrategy;
      break;
    case 'discord':
      InstanceConstructor = DiscordStrategy;
      break;
    default:
      return false;
  }
  const strategy = new InstanceConstructor(
    options[name],
    name === 'jwt'
      ? options.jwt.callback
      : async (accessToken, refreshToken, profile, done) => {
          profile.refreshToken = refreshToken;
          try {
            const user = await User.findOne({
              where: { clientID: profile.id },
            });
            if (user) return done(null, user);
            const email =
              name === 'discord' ? profile.email : profile.emails[0].value;
            const emailInUse = await User.findOne({
              where: { email },
            });
            if (emailInUse) return done({ error: 'Email is in use.' }, false);
            registerUser(
              email,
              generateRandomBytes(),
              (err, account) => {
                if (err) return done(err, false);
                return done(null, account);
              },
              profile.id,
            );
          } catch (error) {
            return done(error, false);
          }
        },
  );
  passport.use(strategy);
  if (name !== 'jwt') refresh.use(strategy);
};
