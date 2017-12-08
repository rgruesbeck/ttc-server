function sendError(res, error) {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: error }));
}

function sendData(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: data }));
}

module.exports = {
  error: sendError,
  data: sendData
};
