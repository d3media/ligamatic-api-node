"use strict";

var username = 'johndoe',
    password = 'secret',
    advertiserId = 'a15',
    client = require('..').create(username, password);

client.get('/advertisers/' + advertiserId + '/segments', function (err, res, body) {
    if (err) {
        return console.error(err);
    }
    if (res.statusCode === 200) {
        console.log(advertiserId, 'segments', body);
    } else {
        console.log(res.headers);
        console.log('whoops', res.statusCode);
    }
});
