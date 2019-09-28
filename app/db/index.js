const Sequelize = require('sequelize');
const { name, username, password, host } = require('../config').database;

module.exports = new Sequelize(name, username, password, {
  host,
  dialect: 'postgres',
});
