/*
  This helper function is used
  for testing the API endpoints.
*/
const axios = require('axios');
const { port } = require('../config').server;

module.exports = async (method, endpoint, data = null, token = '') => {
  axios.defaults.headers.common.Authorization = token;
  const res = await axios[method](`http://localhost:${port}${endpoint}`, data);
  return {
    status: res.status,
    data: res.data,
  };
};
