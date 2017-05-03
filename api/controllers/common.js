'use strict';

var path = require('path');

exports.load_source = function (req, res, next) {
    var filePath = path.resolve('./uploads/' + req.params.sourceId);
    res.sendFile(filePath);
}