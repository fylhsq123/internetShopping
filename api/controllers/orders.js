'use strict';

var mongoose = require('mongoose'),
    Orders = mongoose.model('Orders'),
    Products = mongoose.model('Products'),
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

exports.delete_order = function (req, res, next) {
    if (['admin', 'seller'].indexOf(req.user.role_id.type) < 0) {
        respObj.success = false;
        respObj.response.msg = 'You are not authorized to perform this action';
        respObj.statusCode = 403;
        return res.status(respObj.statusCode).send(respObj);
    }
    Orders.findOneAndUpdate({
        '_id': req.params.orderId,
        'dwh_deleted': false
    }, {
        $set: {
            'dwh_deleted': true
        }
    }).then((obj) => {
        if (obj) {
            respObj.success = true;
            respObj.response.msg = "Order was successfully deleted";
            respObj.statusCode = 200;
        } else {
            respObj.success = false;
            respObj.response.msg = "Order was not found";
            respObj.statusCode = 404;
        }
        res.status(respObj.statusCode).send(respObj);
    }).catch((err) => {
        next({
            'msg': 'Error occured',
            'err': err
        });
    });
};

exports.list_orders = function (req, res, next) {
    var sellerId = req.user._id;
    if (req.query && req.query.sellerid && req.query.sellerid !== req.user._id) {
        if (req.user.role_id.type === 'admin') {
            sellerId = req.query.sellerid;
        } else {
            respObj.success = false;
            respObj.response.msg = 'You are not authorized to perform this action';
            respObj.statusCode = 403;
            return res.status(respObj.statusCode).send(respObj);
        }
    }

    Orders.find({
        'customer_id': sellerId,
        'dwh_deleted': false
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