var blob = require('content-addressable-blob-store');
var store = blob({
  dir: './images',
  tmpdir: './tmp'
});

module.exports = store;
