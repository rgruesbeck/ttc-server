var db = require('../services/levelDB.js');
var store = require('../services/contentBlobStore.js');

var through = require('through2');
var parallel = require('async/parallel');

function imageList(req, res){
  var r = db.createReadStream({
    gt: 'images-recent!',
    lt: 'images-recent!~'
  });
  r.pipe(through.obj(function (row, enc, next) {
    this.push(row.key.split('!')[2] + '\n');
    next();
  })).pipe(res);
};

function imageLoad(req, res){
  var r = store.createReadStream({ key: req.url.slice(1) });
  r.on('error', function (err) { res.end(err + '\n'); });
  r.pipe(res);
}

function imageUpload(req, res){
  //write image to blob store
  var w = store.createWriteStream(function (err, metadata) {
    var now = new Date().toISOString();
    var nowkey = 'images-recent!' + now + '!' + w.key;
    db.batch([
      { type: 'put', key: 'images!' + w.key, value: 0 },
      { type: 'put', key: nowkey, value: 0 }
    ], function (err) {
      if (err) res.end(err + '\n');
      else res.end(
        JSON.stringify({
          URI: 'http:/localhost:5000/images/'.concat(metadata.key),
          IPFS: metadata.key
        }) + '\n'
      );
    });
  });
  req.pipe(w);
};

// experiments here
function imageUploadHandler(req, res){
  parallel([
    function(callback) {
      setTimeout(function() {
        var now = new Date().toISOString();
        var nowkey = 'images-recent!' + now + '!' + w.key;
        callback(null, 'create keys');
      }, 200);
    },
    function(callback) {
      setTimeout(function() {
        callback(null, 'fs store', nowkey);
      }, 200);
    },
    function(callback) {
      setTimeout(function() {
        callback(null, 'ipfs store');
      }, 100);
    },
  ],
  function(err, results) {
    console.log(results);
    res.end('thanks!');
    db.batch([
      { type: 'put', key: 'images!' + w.key, value: 0 },
      { type: 'put', key: nowkey, value: 0 }
    ], function (err) {
      if (err) res.end(err + '\n');
      else res.end(
        JSON.stringify({
          httpURI: 'http:/localhost:5000/'.concat(metadata.key),
          ipfsURI: metadata.key
        }) + '\n'
      );
    });
  });
}

function fsStore(){
  var w = store.createWriteStream();
  req.pipe(w);
}

function ipfsStore(){
  var ipfsBlobStore = require('ipfs-blob-store');
  var options = {
    port: 5001,
    host: '127.0.0.1',
    baseDir: '/',
    flush: true
  };

  var store = ipfsBlobStore(options);

  var ws = store.createWriteStream();
  return ws;
}

module.exports = function(){
  this.addRoute('GET /images', imageList);
  this.addRoute('GET /images/:hash', imageLoad);
  this.addRoute('POST /images', imageUpload);
};
