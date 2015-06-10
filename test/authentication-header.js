"use strict";
var crypto = require('crypto'),
    authToken = require('../lib/auth-token'),
    assert = require('assert'),
    tokenRegex = /^Token (\w+);(\d+);([^$]+)/i,
    credentials = {
        user: 'user',
        password: 'password'
    };

function parseToken(token) {
    var parsed;
    if (!token.match(tokenRegex)) {
        throw new Error('can not parse ' + token);
    }
    parsed = tokenRegex.exec(token);
    return {
        userId: parsed[1],
        timespan: parsed[2],
        hash: parsed[3]
    };
}

function hash(input) {
    var shasum = crypto.createHash('sha1');
    shasum.update(input, 'utf8');
    return shasum.digest('base64');
}

describe('authToken(user, password)', function () {
    describe('#get()', function () {
        var tokenGenerator = authToken.create(credentials.user, credentials.password),
            nowInSecs = Math.ceil(Date.now() / 1000),
            nowRange = [nowInSecs - 1, nowInSecs + 1],
            parsed = parseToken(tokenGenerator.get());
        describe('token', function () {
            it('timespan should be in range ', function () {
                var parsedDate = parsed.timespan;
                assert(parsedDate >= nowRange[0] || parsedDate <= nowRange[1]);
            });
            it('user should be included', function () {
                assert.deepEqual(parsed.userId, credentials.user);
            });
            it('has timespan hashed with the password', function () {

                var expected = hash(parsed.timespan + credentials.password);
                assert.deepEqual(parsed.hash, expected);
            });
        });
    });
    describe('#timeDiff', function () {
        function testTimeDifference(timeDiff) {
            var token, parsed, tokenGenerator = authToken.create(credentials.user, credentials.password),
                nowInSecs = Math.ceil(Date.now() / 1000),
                nowRange = [(nowInSecs + timeDiff) - 1, (nowInSecs + timeDiff) + 1];
            tokenGenerator.timeDiff = timeDiff;
            parsed = tokenRegex.exec(tokenGenerator.get());
            it('should fix time difference', function () {
                var parsedDate = parsed[2];
                assert(parsedDate >= nowRange[0] || parsedDate <= nowRange[1]);
            });
        }
        describe('positive time difference', function () {
            testTimeDifference(22222222);
        });
        describe('negative time difference', function () {
            testTimeDifference(-22222222);
        });
    });
});
