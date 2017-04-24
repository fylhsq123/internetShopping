'use strict';

var mongoose = require('mongoose'),
	CustomersDB = mongoose.model('Customers'),
	jwt = require('jwt-simple'),
	config = require('../config/conf'),
	respObj = {
		"success": false,
		"response": {
			"msg": ""
		}
	};

/**
 * Lists all valid customers that are registered
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.list_all_customers = function (req, res, next) {
	CustomersDB.find({}, function (err, customers) {
		if (err) {
			next({
				'msg': 'Error listing customers',
				'err': err
			});
		} else {
			res.send(customers);
		}
	});
};

/**
 * Method is used to create/register new customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.create_customer = function (req, res, next) {
	var new_customer = new CustomersDB(req.body);
	new_customer.save(function (err, customer) {
		if (err) {
			respObj.success = false;
			if (err.name && err.name === "ValidationError") {
				respObj.response.msg = err.errors;
				res.send(respObj);
			} else if (err.code === 11000) {
				respObj.response.msg = "This email is alreay in use now";
				res.send(respObj);
			} else {
				next({
					'msg': 'Error registering new customer',
					'err': err
				});
			}
		} else {
			res.send(Object.assign({}, customer, {
				'success': true
			}));
		}
	});
};

/**
 * Method is used to read information about customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.read_customer_info = function (req, res, next) {
	var customerId = (req.user.role && req.user.role === 'admin' && req.params.customerId) ?
		req.params.customerId :
		req.user._id;
	CustomersDB.findById(customerId)
		.where({
			'dwh_deleted': false
		})
		.select(Object.assign({}, config.technicalFields, {
			'password': 0
		}))
		.populate('country', 'country')
		.exec(function (err, customer) {
			if (err) {
				next({
					'msg': 'Error reading customer information',
					'err': err
				});
			} else {
				if (customer) {
					res.send(customer);
				} else {
					console.warn('Customer not found');
					respObj.success = false;
					respObj.response.msg = "Customer not found";
					res.send(respObj);
				}
			}
		});
};

/**
 * Method is used to update information about customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.update_customer = function (req, res, next) {
	var customerId = (req.user.role && req.user.role === 'admin' && req.params.customerId) ?
		req.params.customerId :
		req.user._id;
	CustomersDB.findOneAndUpdate({
		'_id': customerId,
		'dwh_deleted': false
	}, {
		$set: req.body
	}, {
		fields: Object.assign({}, config.technicalFields, {
			'password': 0
		})
	}, function (err, customer) {
		if (err) {
			next({
				'msg': 'Error updating information about customer',
				'err': err
			});
		} else {
			if (customer) {
				respObj.success = true;
				respObj.response.msg = "Information about customer was successfully updated";
			} else {
				console.warn('Customer not found');
				respObj.success = false;
				respObj.response.msg = "Customer not found";
			}
			res.send(respObj);
		}
	});
};

/**
 * Method is used to delete customer. Customer will not be deleted, just marked 'dwh_deleted' to 'true'
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.delete_customer = function (req, res, next) {
	var customerId = (req.user.role && req.user.role === 'admin' && req.params.customerId) ?
		req.params.customerId :
		req.user._id;
	CustomersDB.findOneAndUpdate({
		'_id': customerId,
		'dwh_deleted': false
	}, {
		$set: {
			'dwh_deleted': true
		}
	}, function (err, customer) {
		if (err) {
			next({
				'msg': 'Error deleting customer',
				'err': err
			});
		} else {
			if (customer) {
				respObj.success = true;
				respObj.response.msg = "Customer successfully deleted";
			} else {
				console.warn('Customer not found');
				respObj.success = false;
				respObj.response.msg = "Customer not found";
			}
			res.send(respObj);
		}
	});
};

/**
 * Method is used to authenticate customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.authenticate_customer = function (req, res, next) {
	CustomersDB.findOne({
			'email': req.body.email,
			'dwh_deleted': false
		})
		.select(config.technicalFields)
		.populate('country', 'country')
		.exec(function (err, customer) {
			if (err) {
				next({
					'msg': 'Customer authorization error',
					'err': err
				});
			}

			if (!customer) {
				respObj.success = false;
				respObj.response.msg = "Authentication failed. Customer not found";
				res.send(respObj);
			} else {
				// check if password matches
				customer.comparePassword(req.body.password, function (err, isMatch) {
					if (isMatch && !err) {
						// if customer is found and password is right create a token
						var token = jwt.encode(customer, config.jwtSecret);
						// return the information including token as JSON
						var customerInfo = Object.assign({}, {
							success: true,
							token: 'JWT ' + token
						}, customer._doc);
						delete customerInfo.password;
						res.send(customerInfo);
					} else {
						respObj.success = false;
						respObj.response.msg = "Authentication failed. Wrong password";
						res.send(respObj);
					}
				});
			}
		});
};

exports.logout_customer = function (req, res, next) {
	CustomersDB.findOneAndUpdate({
		'_id': req.user._id,
		'dwh_deleted': false
	}, {
		$set: {
			'dwh_online': false
		}
	}, function (err, customer) {
		if (err) {
			next({
				'msg': 'Error logging out customer',
				'err': err
			});
		} else {
			if (customer) {
				respObj.success = true;
				respObj.response.msg = "Customer successfully logged out";
			} else {
				console.warn('Customer not found');
				respObj.success = false;
				respObj.response.msg = "Customer not found";
			}
			res.send(respObj);
		}
	});
};
