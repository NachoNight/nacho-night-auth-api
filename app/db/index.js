const Sequelize = require('sequelize');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { database, server } = require('../config');

const connect = () => {
  const { name, username, password, host, dialect, port } = database;
  const config = {
    connection: () =>
      `postgres://${username}:${password}@${host}:${port}/${name}`,

    options: {
      dialect,
      logging: false,
    },
  };
  if (server.environment === 'staging' || server.environment === 'production') {
    config.dialectOptions = {
      ssl: true,
      ca: readFileSync(resolve(__dirname, '../keys', 'certificate.crt')),
    };
  }
  return new Sequelize(config.connection(), config.options);
};

module.exports = connect();
