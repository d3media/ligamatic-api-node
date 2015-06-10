"use strict";
var assert = require('assert'),
    request = require('request');
exports.defaults = require('./lib/defaults');
exports.authToken = require('./lib/auth-token');
exports.create = function create(username, password, endpoint) {
    var tokenGenerator, ret, requestDefaults;
    assert(username, 'username is required');
    assert(password, 'password is required');
    endpoint = endpoint || exports.defaults.endpoint;
    tokenGenerator = exports.authToken.create(username, password);

    requestDefaults = {
        baseUrl: endpoint,
        headers: {}
    };

    // By defining a getter we can be sure that the header is always up to date
    requestDefaults.headers.__defineGetter__('authentication', tokenGenerator.get.bind(tokenGenerator));
    ret = request.defaults(requestDefaults);
    ret.tokenGenerator = tokenGenerator;
    return ret;
};
