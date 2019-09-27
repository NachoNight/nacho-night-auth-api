// Load .env
require("dotenv").config();

module.exports = {
  port: process.env.SERVER_PORT || 5000,
  environment: process.env.NODE_ENV || "development"
};
