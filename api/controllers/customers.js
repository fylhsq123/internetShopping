'use strict';

var mongoose = require('mongoose'),
	CustomersDB = mongoose.model('Customers'),
	jwt = require('jwt-simple'),
	config = require('../config/conf');
var respObj = {
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
exports.list_all_customers = function (req, res) {
	CustomersDB.find({}, function (err, customers) {
		if (err) {
			console.error('[ERROR]', err);
			respObj.success = false;
			respObj.response.msg = "Error listing customers";
			res.send(respObj);
		}
		res.json(customers);
	});
};

/**
 * Method is used to create/register new customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.create_customer = function (req, res) {
	var new_customer = new CustomersDB(req.body);
	new_customer.save(function (err, customer) {
		if (err) {
			console.error('[ERROR]', err);
			respObj.success = false;
			if (err.name && err.name === "ValidationError") {
				respObj.response.msg = err.errors;
			} else if (err.code === 11000) {
				respObj.response.msg = "This email is alreay in use now";
			} else {
				respObj.response.msg = "DB error";
			}
			res.send(respObj);
		}
		res.json(customer);
	});
};

/**
 * Method is used to read information about customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.read_customer_info = function (req, res) {
	var customerId = (req.user.role && req.user.role === 'admin' && req.params.customerId) ?
		req.params.customerId :
		req.user._id;
	CustomersDB.findById(customerId)
		.where({
			'dwh_deleted': false
		})
		.select(config.technicalFields)
		.exec(function (err, customer) {
			if (err) {
				console.error('[ERROR]', err.message);
				respObj.success = false;
				respObj.response.msg = "Error reading customer information";
				res.send(respObj);
			} else {
				if (customer) {
					res.json(customer);
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
exports.update_customer = function (req, res) {
	var customerId = (req.user.role && req.user.role === 'admin' && req.params.customerId) ? req.params.customerId : req.user._id;
	CustomersDB.findOneAndUpdate({
		'_id': customerId,
		'dwh_deleted': false
	}, {
		$set: req.body
	}, {
		fields: config.technicalFields
	}, function (err, customer) {
		if (err) {
			console.error('[ERROR]', err.message);
			respObj.success = false;
			respObj.response.msg = "Error updating information about customer";
		} else {
			if (customer) {
				respObj.success = true;
				respObj.response.msg = "Information about customer was successfully updated";
			} else {
				console.warn('Customer not found');
				respObj.success = false;
				respObj.response.msg = "Customer not found";
			}
		}
		res.send(respObj);
	});
};

/**
 * Method is used to delete customer. Customer will not be deleted, just marked 'dwh_deleted' to 'true'
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.delete_customer = function (req, res) {
	var customerId = (req.user.role && req.user.role === 'admin' && req.params.customerId) ? req.params.customerId : req.user._id;
	CustomersDB.findOneAndUpdate({
		'_id': customerId,
		'dwh_deleted': false
	}, {
		$set: {
			'dwh_deleted': true
		}
	}, function (err, customer) {
		if (err) {
			console.error('[ERROR]', err.message);
			respObj.success = false;
			respObj.response.msg = "Error deleting customer";
		} else {
			if (customer) {
				respObj.success = true;
				respObj.response.msg = "Customer successfully deleted";
			} else {
				console.warn('Customer not found');
				respObj.success = false;
				respObj.response.msg = "Customer not found";
			}
		}
		res.send(respObj);
	});
};

/**
 * Method is used to authenticate customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 */
exports.authenticate_customer = function (req, res) {
	console.log(req.body.email, req.body.password);
	CustomersDB.findOne({
		email: req.body.email
	}, function (err, customer) {
		if (err) {
			throw err;
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
					res.json({
						success: true,
						token: 'JWT ' + token,
						customerId: customer._id
					});
				} else {
					respObj.success = false;
					respObj.response.msg = "Authentication failed. Wrong password";
					res.send(respObj);
				}
			});
		}
	});
}

exports.logout_customer = function (req, res) {
	CustomersDB.findOneAndUpdate({
		'_id': req.user._id,
		'dwh_deleted': false
	}, {
		$set: {
			'dwh_online': false
		}
	}, function (err, customer) {
		if (err) {
			console.error('[ERROR]', err.message);
			respObj.success = false;
			respObj.response.msg = "Error logging out customer";
		} else {
			if (customer) {
				respObj.success = true;
				respObj.response.msg = "Customer successfully logged out";
			} else {
				console.warn('Customer not found');
				respObj.success = false;
				respObj.response.msg = "Customer not found";
			}
		}
		res.send(respObj);
	});
};
