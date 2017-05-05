'use strict';

var path = require('path'),
    respObj = {
        "success": false,
        "response": {
            "msg": ""
        }
    };

exports.load_source = function (req, res, next) {
    var filePath = path.resolve('./uploads/' + req.params.sourceId);
    res.sendFile(filePath, function (err) {
        if (err) {
            if (err.status === 404) {
                respObj.success = false;
                respObj.response.msg = 'File was not found';
                res.status(404).send(respObj);
            } else {
                next({
                    'msg': 'Error reading file',
                    'err': err
                });
            }
        } else {
            console.log('Sent:', req.params.sourceId);
        }
    });
};