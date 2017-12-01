var ipfsBlobStore = require('ipfs-blob-store');
var store = ipfsBlobStore({
  port: 5001,
  host: '127.0.0.1',
  baseDir: '/',
  flush: true
});

module.exports = store;
