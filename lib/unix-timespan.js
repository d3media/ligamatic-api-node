"use strict";

exports = module.exports = function unixTimespan(ticks) {
    return Math.ceil(ticks / 1000);
};
