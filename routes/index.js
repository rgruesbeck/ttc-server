var routes = require('routes')();
var imageRoutes = require('./image.js');
var cardRoutes = require('./card.js');

imageRoutes.apply(routes);
cardRoutes.apply(routes);

module.exports = routes;
