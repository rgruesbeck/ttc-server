var util = require('util');
var db = require('../services/leveldb.js');
var store = require('../services/store.js');
var BitMark = require('../services/bitmark.js');
var through = require('through2');
var JSONStream = require('JSONStream');
var jsonBody = require('body/json');
var send = require('../services/send.js');
var async = require('async');
var validate = require('../schemas/card.js');

function cardList(req, res){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  db.createReadStream({
    gt: 'card!',
    lt: 'card!~'
  })
    .pipe(JSONStream.stringify())
    .pipe(res);
};

function cardShow(req, res, match){
  db.get(match.params.id, function (error, value) {
    if (error) {
      send.error(res, error);
    } else {
      send.data(res, value);
    }
  });
};

function cardCreate(req, res){
  async.auto({
    // parse & validate card data
    card: function(cb) {
      jsonBody(req, res, function (error, params) {
        if (error) { cb(error); }
        else {
          // todo: needs better validation
          var valid = validate(params);
          if (!valid) { cb(validate.errors); }
          else {
            cb(null, params);
          }
        }
      });
    },
    verifyImage: ['card', function(results, cb) {
      // make sure we have a matching image in the store and get its information
      var imageKey = results.card.media[0].resolve;
      store.resolve({ key: imageKey }, function(error, path) {
        if (error || !path) { cb('Error: Valid Image Not Found'); }
        else {
          db.get(''.concat('image!', imageKey), function(error, value) {
            if (error) { cb('Error: Valid Image Not Found'); }
            else {
              cb(null, {
                path: path,
                image: value
              });
            }
          });
        }
      });
    }],
    bitmark: ['verifyImage', function(results, cb) {
      var bitmark = new BitMark();
      var bm = bitmark.issue(results.verifyImage.path, {
        propertyMetadata: results.card
      })
          .then(function(result) {
            cb(null, result);
          })
          .catch(function(error) {
            cb({ error: "2", message: "Error issuing bitmarks", bitmark_error: error.message });
          });
    }],
    db: [ 'card', 'bitmark', function(results, cb) {
      // write image metadata to db
      var key = ''.concat('card!', Math.random().toString(16).slice(2));
      var value = {
        id: key,
        title: results.card.title,
        description: results.card.description,
        authors: results.card.authors,
        media: [ results.verifyImage ],
        metadata: [ { bitmark: results.bitmark } ]
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
  this.addRoute('GET /cards', cardList);
  this.addRoute('GET /cards/:id', cardShow);
  this.addRoute('POST /cards', cardCreate);
};

