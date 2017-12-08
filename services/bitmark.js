var sdk = require('bitmark-sdk');

function BitMark(seed) {
  if (seed) {
    this.account = new sdk.Account.fromSeed(seed);
  } else {
    this.account = new sdk.Account('testnet');
  }
}

BitMark.prototype.issue = function(file, opts){
  var filePath = file;
  var accessibility = opts.accessibility || "public";
  var propertyName = opts.propertyName || "Totemic Totem";
  var propertyMetadata = opts.propertyMetadata || {
    "author": "Totemic developers"
  };
  var quantity = opts.quantity || 1;

  return this.account.issue(filePath, accessibility, propertyName, propertyMetadata, quantity);
}

module.exports = BitMark;
