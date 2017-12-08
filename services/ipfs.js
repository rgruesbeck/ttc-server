var ipfsAPI = require('ipfs-api');

var ipfs = ipfsAPI({
  host: 'ipfs',
  port: '5001',
  protocol: 'http'
});

module.exports = ipfs;
