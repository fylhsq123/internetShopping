'use strict';

var mongoose = require('mongoose'),
    formidable = require('formidable'),
    cryptiles = require('cryptiles'),
    Products = mongoose.model('Products'),
    Roles = mongoose.model('Roles'),
    config = require('config'),
    events = require('../../common/global-event-emitter'),
    path = require('path'),
    fs = require('fs'),
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
 * Lists valid products that are registered using filter that are specified in request
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.list_all_products = function (req, res, next) {
    var searchCondition = {
            'dwh_deleted': false
        },
        orderCondition = {};
    if (!_isObjectEmpty(req.params)) {
        var params = req.params;
        if (params.sellerId) {
            searchCondition.seller_id = params.sellerId;
        }
        if (params.subcategoryId) {
            searchCondition.subcategory_id = params.subcategoryId;
        }
        if (params.productId) {
            searchCondition._id = params.productId;
        }
        if (params.sortBy && params.sortOrder) {
            orderCondition[params.sortBy] = params.sortOrder === 'desc' ? -1 : 1;
        }
    }
    Products.find(searchCondition)
        .populate('seller', 'first_name last_name')
        .populate({
            path: 'category',
            select: '_id name description parent_id',
            populate: {
                path: 'parent',
                select: '_id name description'
            }
        })
        .sort(orderCondition)
        .select('_id name description image subcategory_id seller_id is_available price_sold count_bought count_sold')
        .exec(function (err, products) {
            if (err) {
                return next({
                    'msg': 'Error reading products',
                    'err': err
                });
            }
            if (products.length === 0) {
                respObj.success = false;
                respObj.response.msg = 'Products were not found';
                res.status(404).send(respObj);
            } else {
                res.send(products);
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
            return next({
                'msg': 'Error getting roles',
                'err': err
            });
        }
        if (role && ['admin', 'seller'].indexOf(role.type) > 0) {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    return next({
                        'msg': 'Parameters cannot be parsed',
                        'err': err
                    });
                }
                var ext, newFileName, targetPath;
                if (!_isObjectEmpty(files) && files.image && /^image\//.test(files.image.type)) {
                    try {
                        ext = path.extname(files.image.name);
                        newFileName = cryptiles.randomString(8) + new Date().getTime();
                        targetPath = path.resolve(config.upload_dir + newFileName + ext);
                        fs.renameSync(files.image.path, targetPath);
                    } catch (err) {
                        return next({
                            'msg': 'Error uploading file',
                            'err': err
                        });
                    }
                }
                Object.assign(fields, {
                    image: newFileName ? newFileName + ext : ""
                });
                var new_product = new Products(fields);
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
                        return;
                    }
                    var response = Object.assign({}, product.toObject(), {
                        'success': true
                    });
                    delete response.dwh_deleted;
                    delete response.dwh_modified_date;
                    delete response.dwh_created_date;
                    Products.findById(response._id)
                        .populate('seller', 'first_name last_name')
                        .populate({
                            path: 'category',
                            select: '_id name description parent_id',
                            populate: {
                                path: 'parent',
                                select: '_id name description'
                            }
                        }).exec(function (err, product) {
                            if (err) {
                                return next({
                                    'msg': 'Error reading product information',
                                    'err': err
                                });
                            }
                            if (product) {
                                events.emit(config.eventNameForNewProduct, {
                                    'name': product.name,
                                    'seller': product.seller,
                                    'category': product.category,
                                    'socket_id': req.cookies.io
                                });
                                res.status(201).send(response);
                            } else {
                                console.warn('Product not found');
                                respObj.success = false;
                                respObj.response.msg = "Product not found";
                                res.status(404).send(respObj);
                            }
                        });
                });
            });
        } else {
            respObj.success = false;
            respObj.response.msg = 'You are not authorized to perform this action';
            res.status(403).send(respObj);
        }
    });
};

/**
 * Method is used to read detailed information about product which is useful for seller
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.read_product_info = function (req, res, next) {
    Roles.findById(req.user.role_id, function (err, role) {
        if (err) {
            return next({
                'msg': 'Error getting roles',
                'err': err
            });
        }
        var fieldsToRemove = config.technicalFields;
        if (role && ['admin', 'seller'].indexOf(role.type) > 0) {
            Products.findById(req.params.productId)
                .where({
                    'dwh_deleted': false
                })
                .populate('seller', 'first_name last_name')
                .populate({
                    path: 'category',
                    select: '_id name description parent_id',
                    populate: {
                        path: 'parent',
                        select: '_id name description'
                    }
                })
                .select(fieldsToRemove)
                .exec(function (err, product) {
                    if (err) {
                        return next({
                            'msg': 'Error reading product information',
                            'err': err
                        });
                    }
                    if (product) {
                        res.send(product);
                    } else {
                        console.warn('Product not found');
                        respObj.success = false;
                        respObj.response.msg = "Product not found";
                        res.status(404).send(respObj);
                    }
                });
        } else {
            respObj.success = false;
            respObj.response.msg = 'You are not authorized to perform this action';
            res.status(403).send(respObj);
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
    Roles.findById(req.user.role_id, function (err, role) {
        if (err) {
            return next({
                'msg': 'Error getting roles',
                'err': err
            });
        }
        if (role && ['admin', 'seller'].indexOf(role.type) > 0) {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    return next({
                        'msg': 'Parameters cannot be parsed',
                        'err': err
                    });
                }
                var ext, newFileName, targetPath;
                if (!_isObjectEmpty(files) && files.image && /^image\//.test(files.image.type)) {
                    try {
                        ext = path.extname(files.image.name);
                        newFileName = cryptiles.randomString(8) + new Date().getTime();
                        targetPath = path.resolve(config.upload_dir + newFileName + ext);
                        fs.renameSync(files.image.path, targetPath);
                    } catch (err) {
                        return next({
                            'msg': 'Error uploading file',
                            'err': err
                        });
                    }
                }
                if (newFileName) {
                    Object.assign(fields, {
                        image: newFileName + ext
                    });
                }
                var updateConditions = {
                    '_id': req.params.productId,
                    'dwh_deleted': false
                };
                if (role.type === 'seller') {
                    Object.assign(updateConditions, {
                        'seller_id': req.user._id
                    });
                }
                Products.findOneAndUpdate(updateConditions, {
                    $set: fields
                }, function (err, product) {
                    if (err) {
                        return next({
                            'msg': 'Error updating product',
                            'err': err
                        });
                    }
                    if (product) {
                        respObj.success = true;
                        respObj.response.msg = "Product successfully updated";
                        res.send(respObj);
                    } else {
                        console.warn('Product not found');
                        respObj.success = false;
                        respObj.response.msg = "Product not found";
                        res.status(404).send(respObj);
                    }
                });
            });
        } else {
            respObj.success = false;
            respObj.response.msg = 'You are not authorized to perform this action';
            res.status(403).send(respObj);
        }
    });
};

/**
 * Method is used to delete product. It will not be deleted, just marked 'dwh_deleted' to 'true'
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.delete_product_info = function (req, res, next) {
    Roles.findById(req.user.role_id, function (err, role) {
        if (err) {
            return next({
                'msg': 'Error getting roles',
                'err': err
            });
        }
        if (role && ['admin', 'seller'].indexOf(role.type) > 0) {
            var deleteConditions = {
                '_id': req.params.productId,
                'dwh_deleted': false
            };
            if (role.type === 'seller') {
                Object.assign(deleteConditions, {
                    'seller_id': req.user._id
                });
            }
            Products.findOneAndUpdate(deleteConditions, {
                $set: {
                    'dwh_deleted': true
                }
            }, function (err, product) {
                if (err) {
                    return next({
                        'msg': 'Error deleting product',
                        'err': err
                    });
                }
                if (product) {
                    respObj.success = true;
                    respObj.response.msg = "Product successfully deleted";
                    res.send(respObj);
                } else {
                    console.warn('Product not found');
                    respObj.success = false;
                    respObj.response.msg = "Product not found";
                    res.status(404).send(respObj);
                }
            });
        } else {
            respObj.success = false;
            respObj.response.msg = 'You are not authorized to perform this action';
            res.status(403).send(respObj);
        }
    });
};