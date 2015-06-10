"use strict";
var crypto = require('crypto');
function sha1hash(input) {
    var shasum = crypto.createHash('sha1');
    shasum.update(input, 'utf8');
    return shasum.digest('base64');
}
exports = module.exports = sha1hash;
