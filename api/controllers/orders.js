'use strict';

var mongoose = require('mongoose'),
    Orders = mongoose.model('Orders'),
    config = require('config'),
    Products = mongoose.model('Products'),
    Roles = mongoose.model('Roles'),
    Promise = require('bluebird'),
    respObj = {
        "success": false,
        "response": {
            "msg": ""
        }
    };

exports.make_order = function (req, res, next) {
    var orderData = Object.assign({}, req.body, {
            "customer_id": req.user._id
        }),
        items = orderData.items,
        promises = [];
    for (var i = 0; i < items.length; i++) {
        let item = items[i];
        promises.push(Products.findById(items[i]._id).exec().then((obj) => {
            if (!obj) {
                respObj.success = false;
                respObj.response.msg = `Product with ID${item._id} was not found`;
                respObj.statusCode = 404;
                throw respObj;
            }
            if (!obj.is_available) {
                respObj.success = false;
                respObj.response.msg = `Product ${obj.name} is not available`;
                respObj.statusCode = 400;
                throw respObj;
            }
            item.price = obj.price_sold;
        }));
    }
    Promise.all(promises).then(() => {
        var order = new Orders(orderData);
        return order.save();
    }).then((obj) => {
        var response = obj.toObject();
        delete response.__v;
        delete response.dwh_modified_date;
        delete response.dwh_created_date;
        res.status(201).send(response);
    }).catch((err) => {
        if (err.statusCode) {
            res.status(err.statusCode).send(err);
        } else {
            next({
                'msg': 'Error occured',
                'err': err
            });
        }
    });
};

exports.get_order = function (req, res, next) {
    Orders.findById(req.params.orderId).populate('items.info', 'name description image').select('-__v -dwh_modified_date -dwh_created_date').then((order) => {
        if (order) {
            res.send(order);
        } else {
            respObj.success = false;
            respObj.response.msg = `Order was not found`;
            respObj.statusCode = 404;
            throw respObj;
        }
    }).catch((err) => {
        if (err.statusCode) {
            res.status(err.statusCode).send(err);
        } else {
            next({
                'msg': 'Error occured',
                'err': err
            });
        }
    });
};

exports.update_order = function (req, res, next) {};
exports.delete_order = function (req, res, next) {};

exports.list_orders = function (req, res, next) {
    
    Orders.find({
        'customer_id': req.user._id
    }).populate('items.info', 'name description image').select('-__v -dwh_modified_date -dwh_created_date').then((orders) => {
        res.send(orders);
    }).catch((err) => {
        if (err.statusCode) {
            res.status(err.statusCode).send(err);
        } else {
            next({
                'msg': 'Error occured',
                'err': err
            });
        }
    });
};