// Load .env
require('dotenv').config();

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
    secret: process.env.SECRET,
  },
  database: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
  },
  mail: {
    host: process.env.SMTP_HOSTNAME,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    sender: process.env.MAIL_SENDER,
  },
  oauth: {
    google: {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    discord: {
      clientID: process.env.DISCORD_OAUTH_CLIENT_ID,
      clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
      callbackURL: '/auth/discord/callback',
    },
    twitter: {
      consumerKey: process.env.TWITTER_OAUTH_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_OAUTH_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/callback',
    },
  },
};
