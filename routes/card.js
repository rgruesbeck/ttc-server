var db = require('../services/levelDB.js');
var jsonBody = require('body/json');
var parallel = require('async/parallel');

function cardCreate(req, res){
  jsonBody(req, res, function (err, params) {
    if (err) return console.error(err);
    console.log(params);
    var key = 'card!'.concat(Math.random().toString(16).slice(2));
    db.put(key, params, function (err) {
      if (err) res.end(err);
      else res.end(JSON.stringify(params));
    });
  });
};

module.exports = function(){
  this.addRoute('POST /cards', cardCreate);
};
