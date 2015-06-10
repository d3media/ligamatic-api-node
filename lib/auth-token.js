"use strict";
var sha1hash = require('./hash'),
    unixTimespan = require('./unix-timespan'),
    TOKEN = 'Token ',
    FIELD_SEPARATOR = ';';

exports.create = function (user, password) {
    var tokenPlusUserID = TOKEN + user + FIELD_SEPARATOR;
    return {
        timeDiff: 0,
        get: function () {
            var timespan = unixTimespan(Date.now()) + this.timeDiff,
                hash = sha1hash(timespan + password);
            return tokenPlusUserID +
                timespan +
                FIELD_SEPARATOR +
                hash;
        }
    };
};
