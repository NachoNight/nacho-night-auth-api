/**
 * The primary use for the caching system
 * is to hold crypto tokens used for password recovery.
 * Currently, all keys expire after an hour and there is
 * an automatic check performed every 5 seconds for dead keys.
 */
const NodeCache = require('node-cache');

module.exports = new NodeCache({ stdTTL: 3600, checkperiod: 300 });
