var db = require('../services/levelDB.js');
var store = require('../services/contentBlobStore.js');
var ipfs = require('../services/ipfsBlobStore.js');

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
  res.setHeader('content-type', 'image/jpeg');
  var w = store.createWriteStream();
  req.pipe(w);
  w.on('finish', function () {
    var now = new Date().toISOString();
    var nowkey = 'images-recent!' + now + '!' + w.key;
    db.batch([
      { type: 'put', key: 'images!' + w.key, value: 0 },
      { type: 'put', key: nowkey, value: 0 }
    ], function (err) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(err);
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            URI: '/images/'.concat(w.key),
            IPFS: w.key
          })
        );
      }
    });
  });
};

// experiments here
function imageUploadHandler(req, res){
  parallel({
    local: function(cb) {
      //content store
      var ws = store.createWriteStream(function (err, metadata) {
        if (err) cb(err);
        cb(null, metadata.key);
      });
      req.pipe(ws);
    },
    ipfs: function(cb) {
      //ipfs store
      cb(null, 'ipfs hash');
    },
  },
  function(err, hash) {
    if (err) res.end(err + '\n');
    console.log(hash);
    var now = new Date().toISOString();
    var nowkey = 'images-recent!' + now + '!' + hash.local;

    db.batch([
      { type: 'put', key: 'images!' + hash.local, value: 0 },
      { type: 'put', key: nowkey, value: 0 }
    ], function (err) {
      if (err) res.end(err + '\n');
      else res.end(
        JSON.stringify({
          URI: '/images/'.concat(hash.local),
          IPFS: hash.ipfs
        }) + '\n'
      );
    });
  });
}

function ipfsStore(req, res){
  var w = store.createWriteStream();
  var ws = ipfs.createWriteStream({ name: 'cat.jpg' });
  req.pipe(w);
  req.pipe(ws);

  ws.end(function() {
    var rs = store.createReadStream({
      key: ws.key
    });

    rs.pipe(res);
  });
}

module.exports = function(){
  this.addRoute('GET /images', imageList);
  this.addRoute('GET /images/:hash', imageLoad);
  this.addRoute('POST /images', imageUpload);
  this.addRoute('POST /ipfs', ipfsStore);
};
