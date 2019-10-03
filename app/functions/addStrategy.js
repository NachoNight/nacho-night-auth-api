/* eslint-disable indent */
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy: DiscordStrategy } = require('passport-discord');
const { Strategy: TwitterStrategy } = require('passport-twitter');
const refresh = require('passport-oauth2-refresh');
const { secret } = require('../config').server;
const { google, discord, twitter } = require('../config').oauth;
const registerUser = require('./registerUser');
const generateRandomBytes = require('./generateRandomBytes');
const User = require('../db/models/user.model');

/**
 * The way this function works
 * is by taking in an array of
 * objects that contain a name key
 * which is used to target a specific
 * constructor, in which we pass
 * corresponding options for the strategy
 * we want to instantiate.
 */
module.exports = (passport, { name }) => {
  // Configuration
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
    google,
    discord: {
      ...discord,
      scope: ['identify', 'email'],
    },
    twitter,
    default: {
      callback: async (accessToken, refreshToken, profile, done) => {
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
    },
  };
  // Determine which constructor to call
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
    case 'twitter':
      InstanceConstructor = TwitterStrategy;
      break;
    default:
      return false;
  }
  // Instantiate the strategy and apply it
  const strategy = new InstanceConstructor(
    options[name],
    name === 'jwt' ? options.jwt.callback : options.default.callback,
  );
  passport.use(strategy);
  if (name !== 'jwt') refresh.use(strategy);
};
