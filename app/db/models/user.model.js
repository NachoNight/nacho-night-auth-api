const Sequelize = require('sequelize');
const uuid = require('uuid/v4');
const database = require('../');

const User = database.define('User', {
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  banned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  created: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  clientID: {
    type: Sequelize.STRING,
    defaultValue: uuid(),
  },
});

module.exports = User;
