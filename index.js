var http = require('http');
var router = require('./routes');

var server = http.createServer(function (req, res) {
  console.log(req.method, req.url, req.headers);
  var path = "".concat(req.method, ' ', req.url);
  var match = router.match(path);
  if (match) match.fn(req, res, match);
  else res.end('error');
});

server.listen(5000);
