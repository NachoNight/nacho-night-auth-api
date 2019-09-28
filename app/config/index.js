// Load .env
require('dotenv').config();

module.exports = {
  port: process.env.SERVER_PORT || 5000,
  secret: process.env.SECRET,
  environment: process.env.NODE_ENV || 'development',
  database: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  mail: {
    host: process.env.SMTP_HOSTNAME,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};
