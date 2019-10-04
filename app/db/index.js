const Sequelize = require('sequelize');
const {
  name,
  username,
  password,
  host,
  dialect,
  port,
} = require('../config').database;

module.exports = new Sequelize(name, username, password, {
  host,
  dialect,
  port,
  logging: false,
});
