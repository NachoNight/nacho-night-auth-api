const Sequelize = require('sequelize');
const database = require('../');

const Address = database.define('Address', {
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  added: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Address;
