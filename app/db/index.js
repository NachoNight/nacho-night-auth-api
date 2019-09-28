const Sequelize = require('sequelize');
const { name, username, password, host, dialect } = require('../config').database;

module.exports = new Sequelize(name, username, password, {
  host,
  dialect,
  logging: false,
});
