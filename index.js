var http = require('http');
var router = require('./routes');

var allowedHosts = {
  'http://localhost:3000': true
};

var allowCrossDomain = function(req, res, next) {
  if (req.headers.origin && allowedHosts[req.headers.origin]) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Content-Name, Date, X-Api-Version');
    if (req.method == 'OPTIONS') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
    }
    else next(req, res);
  }
  else {
    next(req, res);
  }
}

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url);
  allowCrossDomain(req, res, function() {
    var path = "".concat(req.method, ' ', req.url);
    var match = router.match(path);
    if (match) match.fn(req, res, match);
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
    }
  });
});

server.listen(5000);
