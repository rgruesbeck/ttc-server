var db = require('../services/levelDB.js');
var jsonBody = require('body/json');
var parallel = require('async/parallel');

function cardCreate(req, res){
  jsonBody(req, res, function (err, params) {
    if (err) return console.error(err);
    var key = 'card!'.concat(
      Math.random().toString(16).slice(2),
      '!',
      params.id
    );
    db.put(key, params, function (err) {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(err);
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(params));
      }
    });
  });
};

module.exports = function(){
  this.addRoute('POST /cards', cardCreate);
};
