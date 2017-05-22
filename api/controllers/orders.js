'use strict';

var mongoose = require('mongoose'),
    Orders = mongoose.model('Orders'),
    Products = mongoose.model('Products'),
    config = require('config'),
    respObj = {
        "success": false,
        "response": {
            "msg": ""
        }
    };

exports.make_order = function (req, res, next) {
    console.log(req.body);
    res.send({
        success: true
    });
};