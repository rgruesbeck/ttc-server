var Ajv = require('ajv');
var ajv = new Ajv();

var schema = {
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "description": { "type": "string" },
    "authors": { "type": "array" },
    "media": { "type": "array" },
    "metadata": { "type": "array" }
  },
  "required": [
    "title",
    "description",
    "authors",
    "media",
    "metadata"
  ]
};

module.exports = ajv.compile(schema);
