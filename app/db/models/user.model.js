const { STRING, BOOLEAN, DATE, NOW } = require('sequelize');
const uuid = require('uuid/v4');
const database = require('../');

const User = database.define('User', {
  email: {
    type: STRING,
    unique: true,
  },
  password: {
    type: STRING,
  },
  verified: {
    type: BOOLEAN,
    defaultValue: false,
  },
  banned: {
    type: BOOLEAN,
    defaultValue: false,
  },
  created: {
    type: DATE,
    defaultValue: NOW,
  },
  clientID: {
    type: STRING,
    defaultValue: uuid(),
  },
});

module.exports = User;
