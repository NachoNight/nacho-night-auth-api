const Sequelize = require('sequelize');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { database, server } = require('../config');

const connect = () => {
  const { URL, name, username, password, host, dialect, port } = database;
  const config = {
    connection: () => {
      if (URL) return URL;
      return `postgres://${username}:${password}@localhost:5432/${name}`;
    },
    options: {
      host,
      dialect,
      port,
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
