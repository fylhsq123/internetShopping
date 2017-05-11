'use strict';

var mongoose = require('mongoose'),
	CustomersDB = mongoose.model('Customers'),
	Roles = mongoose.model('Roles'),
	jwt = require('jwt-simple'),
	config = require('config'),
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
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.list_all_customers = function (req, res, next) {
	Roles.findById(req.user.role_id, function (err, role) {
		if (err) {
			next({
				'msg': 'Error getting roles',
				'err': err
			});
		} else {
			if (role && role.type === 'admin') {
				CustomersDB.find({})
					.select({
						'password': 0
					})
					.populate({
						path: 'country',
						select: 'country'
					})
					.populate({
						path: 'role_id',
						select: '-_id name type'
					})
					.exec(function (err, customers) {
						if (err) {
							next({
								'msg': 'Error listing customers',
								'err': err
							});
						} else {
							res.send(customers);
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

/**
 * Method is used to create/register new customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.create_customer = function (req, res, next) {
	var new_customer = new CustomersDB(req.body);
	new_customer.save(function (err, customer) {
		if (err) {
			respObj.success = false;
			if (err.name && err.name === "ValidationError") {
				respObj.response.msg = err.errors;
				res.status(400).send(respObj);
			} else if (err.code === 11000) {
				respObj.response.msg = "This email is alreay in use now";
				res.status(409).send(respObj);
			} else {
				next({
					'msg': 'Error registering new customer',
					'err': err
				});
			}
		} else {
			var response = Object.assign({}, customer._doc, {
				'success': true
			});
			delete response.dwh_deleted;
			delete response.dwh_online;
			delete response.dwh_modified_date;
			delete response.dwh_created_date;
			delete response.personal_key;
			delete response.password;
			delete response.role_id;
			res.status(201).send(response);
		}
	});
};

/**
 * Method is used to read information about customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.read_customer_info = function (req, res, next) {
	Roles.findById(req.user.role_id, function (err, role) {
		var userId = req.user._id;
		if (err) {
			return next({
				'msg': 'Error getting roles',
				'err': err
			});
		}
		if (role && role.type === 'admin') {
			userId = req.params.customerId || userId;
		}
		CustomersDB.findById(userId).where({
			'dwh_deleted': false
		}).select(Object.assign({}, config.technicalFields, {
			'password': 0
		})).populate({
			path: 'country',
			select: 'country'
		}).populate({
			path: 'role_id',
			select: '-_id name type'
		}).exec(function (err, customer) {
			if (err) {
				next({
					'msg': 'Error reading customer information',
					'err': err
				});
			} else {
				if (customer) {
					res.send(customer);
				} else {
					respObj.success = false;
					respObj.response.msg = "Customer not found";
					res.status(400).send(respObj);
				}
			}
		});
	});
};

/**
 * Method is used to update information about customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.update_customer = function (req, res, next) {
	CustomersDB.findOneAndUpdate({
		'_id': req.user._id,
		'dwh_deleted': false
	}, {
		$set: req.body
	}, {
		fields: Object.assign({}, config.technicalFields, {
			'password': 0
		}),
		runValidators: true
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
				res.send(respObj);
			} else {
				respObj.success = false;
				respObj.response.msg = "Customer not found";
				res.status(400).send(respObj);
			}
		}
	});
};

/**
 * Method is used to delete customer. Customer will not be deleted, just marked 'dwh_deleted' to 'true'
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.delete_customer = function (req, res, next) {
	CustomersDB.findOneAndUpdate({
		'_id': req.user._id,
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
				res.send(respObj);
			} else {
				respObj.success = false;
				respObj.response.msg = "Customer not found";
				res.status(400).send(respObj);
			}
		}
	});
};

/**
 * Method is used to authenticate customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.authenticate_customer = function (req, res, next) {
	CustomersDB.findOne({
			'email': req.body.email,
			'dwh_deleted': false
		})
		.select(config.technicalFields)
		.populate({
			path: 'country',
			select: 'country'
		})
		.populate({
			path: 'role_id',
			select: '-_id name type'
		})
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
				res.status(403).send(respObj);
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
						res.status(403).send(respObj);
					}
				});
			}
		});
};

/**
 * Method is used to logout customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
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
				res.send(respObj);
			} else {
				respObj.success = false;
				respObj.response.msg = "Customer not found";
				res.status(400).send(respObj);
			}
		}
	});
};