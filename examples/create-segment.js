"use strict";

var username = 'johndoe',
    password = 'secret',
    advertiserId = 'a15',
    client = require('..').create(username, password);

var payload = {
    url: '/advertisers/' + advertiserId + '/segments',
    json: true,
    body: {
        _code: 123,
        name: 'pizza lovers'
    }
};

client.post(payload, function (err, res, body) {
    if (err) {
        return console.error(err);
    }
    console.log(res.headers);
    console.log(res.statusCode);
});
