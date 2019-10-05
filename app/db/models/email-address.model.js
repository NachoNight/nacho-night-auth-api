const { STRING, DATE, NOW } = require('sequelize');
const database = require('../');

const EmailAddress = database.define('Address', {
  email: {
    type: STRING,
    unique: true,
  },
  added: {
    type: DATE,
    defaultValue: NOW,
  },
});

module.exports = EmailAddress;
