// card tests

const test = require('tape');
const http = require('http');
const concat = require('concat-stream');

function randomString() {
  return Math.random().toString(16).slice(2);
}

test('GET /cards', (t) => {
  t.plan(3);

  // GET /card
  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/cards',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    res.setEncoding('utf8');

    // Status is 200
    t.equal(res.statusCode, 200, 'Status is 200');

    // Content Type is application/json
    t.equal(res.headers['content-type'], 'application/json', 'Content Type is application/json');

    res.pipe(concat((body) => {
      // Body is a JSON list
      t.equal(JSON.parse(body).constructor, Array, 'Body is a JSON list');
    }));
  });
  req.end();

});

test('GET /cards/:id && card does not exist', (t) => {
  t.plan(3);

  // Add test card
  const cardId = 'card!'.concat(randomString());

  // GET /card/:id of random id
  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/cards/'.concat(cardId),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    res.setEncoding('utf8');

    // Status is 500
    t.equal(res.statusCode, 500, 'Status is 500');

    // Content Type is application/json
    t.equal(res.headers['content-type'], 'application/json', 'Content Type is application/json');

    res.pipe(concat((body) => {
      // Body is a JSON list
      t.equal(JSON.parse(body).constructor, Object, 'Body is a JSON object');
    }));
  });
  req.end();

});

test('GET /cards/:id && card exists', (t) => {
  t.plan(1);
  t.equal(true, true, 'Pending test, needs db access');
});

test('POST /cards', (t) => {
  t.plan(3);

  // POST /card
  //const testImageHash = "39952d8c3c1981007b6ac0772f5bef8ff755ab81685e9252baf55df321eaa2cb";
  const testImageHash = "3595cfad158f138d1cccca4c35da17b37cada25f64e18a8c56c1f424486fb579";
  // const testImageHash = "454539ae58ca59b18db791d04e9ae9f03fed1f19f3576300448d269422970825";
  const card = {
    title: 'Card Title',
    description: 'Card Description',
    authors: [
      {
        role: "creator",
        name: "Creative Person",
        email: "hello@creative.space"
      }
    ],
    media: [
      {
        "resolve": testImageHash
      }
    ],
    metadata: []
  };

  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/cards',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    res.setEncoding('utf8');

    // Status is 200
    t.equal(res.statusCode, 200, 'Status is 200');

    // Content Type is application/json
    t.equal(res.headers['content-type'], 'application/json', 'Content Type is application/json');

    res.pipe(concat((body) => {
      // Body is a JSON list
      t.equal(JSON.parse(body).constructor, Object, 'Body is a JSON object');
      console.log(body);
    }));
  });
  req.write(JSON.stringify(card));
  req.end();
});
