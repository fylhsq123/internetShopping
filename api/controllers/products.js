'use strict';

var mongoose = require('mongoose'),
    Products = mongoose.model('Products'),
    Roles = mongoose.model('Roles'),
    config = require('../config/conf.js'),
    respObj = {
        "success": false,
        "response": {
            "msg": ""
        }
    };

function _isObjectEmpty(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * Lists all valid products that are registered
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.list_all_products = function (req, res, next) {
    var searchCondition = {'dwh_deleted': false},
        orderCondition = {};
    if (!_isObjectEmpty(req.params)) {
        var params = req.params;
        if (params.sellerId) {
            searchCondition.seller_id = params.sellerId;
        }
        if (params.subcategoryId) {
            searchCondition.subcategory_id = params.subcategoryId;
        }
        if (params.sortBy && params.sortOrder) {
            orderCondition[params.sortBy] = params.sortOrder === 'desc' ? -1 : 1;
        }
    }
    Products.find(searchCondition).select('_id name description image subcategory_id seller_id').sort(orderCondition).exec(function (err, products) {
        if (err) {
            next({
                'msg': 'Error reading products',
                'err': err
            });
        } else {
            if (products.length === 0) {
                respObj.success = false;
                respObj.response.msg = 'Products were not found';
                res.status(404).send(respObj);
            } else {
                res.send(products);
            }
        }
    });
};

/**
 * Method is used to create/register new product
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.create_new_product = function (req, res, next) {
    Roles.findById(req.user.role_id, function (err, role) {
        if (err) {
            next({
                'msg': 'Error getting roles',
                'err': err
            });
        } else {
            if (role && ['admin', 'seller'].indexOf(role.type) > 0) {
                var new_product = new Products(req.body);
                new_product.save(function (err, product) {
                    if (err) {
                        respObj.success = false;
                        if (err.name && err.name === "ValidationError") {
                            respObj.response.msg = err.errors;
                            res.status(400).send(respObj);
                        } else {
                            next({
                                'msg': 'Error registering new product',
                                'err': err
                            });
                        }
                    } else {
                        var response = Object.assign({}, product._doc, {
                            'success': true
                        });
                        delete response.dwh_deleted;
                        delete response.dwh_modified_date;
                        delete response.dwh_created_date;
                        res.status(201).send(response);
                    }
                });
            } else {
                respObj.success = false;
                respObj.response.msg = 'You are not authorized to perform this action';
                res.status(403).send(respObj);
            }
        }
    });
};

exports.read_general_product_info = function (req, res, next) {
    var fieldsToRemove = Object.assign({}, config.technicalFields, {
        'count_bought': 0,
        'count_sold': 0,
        'price_bought': 0
    });
    Products.findById(req.params.productId)
        .where({
            'dwh_deleted': false
        })
        .select(fieldsToRemove)
        // 	.populate({path: 'role_id', select: '-_id name'})
        .exec(function (err, product) {
            if (err) {
                next({
                    'msg': 'Error reading product information',
                    'err': err
                });
            } else {
                if (product) {
                    res.send(Object.assign({}, product._doc, {
                        'is_available': product.is_available
                    }));
                } else {
                    console.warn('Product not found');
                    respObj.success = false;
                    respObj.response.msg = "Product not found";
                    res.status(404).send(respObj);
                }
            }
        });
};

/**
 * Method is used to read information about product
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.read_product_info = function (req, res, next) {
    console.log(req.user);
    req.user = {
        role_id: "58f9c8d7f18c6738304061eb"
    };
    Roles.findById(req.user.role_id, function (err, role) {
        if (err) {
            next({
                'msg': 'Error getting roles',
                'err': err
            });
        } else {
            var fieldsToRemove = config.technicalFields;
            if (role && ['admin', 'seller'].indexOf(role.type) <= 0) {
                fieldsToRemove = Object.assign({}, config.technicalFields, {
                    'count_bought': 0,
                    'count_sold': 0,
                    'price_bought': 0
                });
            }
            Products.findById(req.params.productId)
                .where({
                    'dwh_deleted': false
                })
                .select(fieldsToRemove)
                // 	.populate({path: 'role_id', select: '-_id name'})
                .exec(function (err, product) {
                    if (err) {
                        next({
                            'msg': 'Error reading product information',
                            'err': err
                        });
                    } else {
                        if (product) {
                            res.send(Object.assign({}, product._doc, {
                                'is_available': product.is_available
                            }));
                        } else {
                            console.warn('Product not found');
                            respObj.success = false;
                            respObj.response.msg = "Product not found";
                            res.send(respObj);
                        }
                    }
                });
        }
    });
};

/**
 * Method is used to update information about product
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.update_product_info = function (req, res, next) {

};

/**
 * Method is used to delete product. It will not be deleted, just marked 'dwh_deleted' to 'true'
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.delete_product_info = function (req, res, next) {

};