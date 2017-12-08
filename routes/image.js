var db = require('../services/leveldb.js');
var store = require('../services/store.js');
var ipfs = require('../services/ipfs.js');
var JSONStream = require('JSONStream');
var send = require('../services/send.js');
var passthrough = require('stream').PassThrough;

var through = require('through2');
var async = require('async');

function imageList(req, res){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  db.createReadStream({
    gt: 'image!',
    lt: 'image!~'
  })
    .pipe(JSONStream.stringify())
    .pipe(res);
};

function imageShow(req, res, match){
  var r = store.createReadStream({ key: match.params.key });
  r.on('error', function (error) { send.error(res, error); });
  r.pipe(res);
}

function imageUpload(req, res){
  // todo: only accept images

  // split request stream
  var storeReq = new passthrough; req.pipe(storeReq);
  var ipfsReq = new passthrough; req.pipe(ipfsReq);

  // add image data to db
  async.auto({
    store: function(cb) {
      // add image to store
      var ws = store.createWriteStream(function(error, metadata) {
        if (error) { cb(error); }
        else {
          cb(null, {
            key: metadata.key,
            type: req.headers['content-type'],
            name: req.headers['content-name'],
            uri: ''.concat('/images/', metadata.key)
          });
        }
      });
      storeReq.pipe(ws);
    },
    ipfs: function(cb) {
      // add image to ipfs
      ipfs.util.addFromStream(ipfsReq, function(error, result) {
        if (error) { cb(error.toString()); }
        else {
          cb(null, result);
        }
      });
    },
    db: [ 'store', 'ipfs', function(results, cb) {
      // write image metadata to db
      var key = ''.concat('image!', results.store.key);
      var value = {
        key: results.store.key,
        uri: results.store.uri,
        ipfs: results.ipfs[0].hash,
        type: results.store.type,
        name: results.store.name
      };
      db.put(key, value, function(error) {
        if (error) { cb(error); }
        else {
          cb(null, value);
        }
      });
    }]
  }, function(error, results) {
    if (error) { send.error(res, error); }
    else {
      send.data(res, results.db);
    }
  });
}

module.exports = function(){
  this.addRoute('GET /images', imageList);
  this.addRoute('GET /images/:key', imageShow);
  this.addRoute('POST /images', imageUpload);
};
