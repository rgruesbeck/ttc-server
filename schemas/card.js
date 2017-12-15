var Ajv = require('ajv');
var ajv = new Ajv();

var schema = {
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "description": { "type": "string" },
    "authors": {
      "type": "array",
      "contains": {
        "type": "object",
        "properties": {
          "role": { "type": "string" },
          "name": { "type": "string" },
          "email": { "type": "string" }
        },
        "required": [
          "role",
          "name",
          "email"
        ]
      }
    },
    "media": {
      "type": "array",
      "contains": {
        "type": "object",
        "properties": {
          "resolve": { "type": "string" }
        }
      }
    },
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
