"use strict";
var client = require('../../'),
    assert = require('assert'),
    http = require('http'),
    calls = [];

function api(req, res) {
    var log = {
        url: req.originalUrl,
        headers: req.headers,
        contents: ''
    };
    req.on('data', function (chunk) {
        log.contents += chunk.toString();
    });
    req.on('end', function () {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        calls.push(log);
        res.end();
    });
}

describe('Headers', function () {
    var server, options = {
        endpoint: 'is set on server api init!',
        username: 'user',
        password: 'secret'
    };
    after(function (done) {
        server.close(done);
    });
    before(function (done) {
        // We will create an enpoint server and
        // make a request every 2 seconds to make sure
        // the headers are getting updated on every call
        server = http.createServer(api).listen(function (err) {
            var apiClient;
            options.endpoint = 'http://localhost:' + server.address().port;
            apiClient = client.create(options.username, options.password, options.endpoint);
            server.interval = setInterval(function () {
                if (calls.length === 3) {
                    clearInterval(server.interval);
                    return done();
                }
                apiClient.get('/', function () {});
            }, 2000);
        });
    });
    it('should be updated on every call', function () {
        var ts = calls.reduce(function (acc, curr) {
            acc[curr.headers.authentication] = true;
            return acc;
        }, {});
        assert.deepEqual(Object.keys(ts).length, 3);
    });
});
