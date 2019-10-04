const Sequelize = require('sequelize');
const { database, server } = require('../config');

const connect = () => {
  const env = server.environment;
  const { name, username, password, host, dialect, port } = database[env];
  const config = {
    host,
    dialect,
    port,
    logging: false,
  };
  if (env === 'staging') config.dialectOptions = database[env].dialectOptions;
  return new Sequelize(name, username, password, config);
};

module.exports = connect();
