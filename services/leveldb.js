var level = require('level');
var db = level('./db', { valueEncoding: 'json' });

module.exports = db;
