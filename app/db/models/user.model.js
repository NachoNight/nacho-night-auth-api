const Sequelize = require('sequelize');
const database = require('../');

const User = database.define('User', {
  email: {
    type: Sequelize.STRING,
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
});

module.exports = User;
