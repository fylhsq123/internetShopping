'use strict';

var mongoose = require('mongoose'),
	Customers = mongoose.model('Customers'),
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
	if (req.user.role_id.type === 'admin') {
		Customers.find({}).select({
			'password': 0
		}).populate({
			path: 'country',
			select: 'country'
		}).populate({
			path: 'role_id',
			select: '-_id name type'
		}).exec().then((obj) => {
			res.send(obj);
		}).catch((err) => {
			next({
				'msg': 'Error occured',
				'err': err
			});
		});
	} else {
		respObj.success = false;
		respObj.response.msg = 'You are not authorized to perform this action';
		respObj.statusCode = 403;
		res.status(respObj.statusCode).send(respObj);
	}
};

/**
 * Method is used to create/register new customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.create_customer = function (req, res, next) {
	var new_customer = new Customers(req.body);
	new_customer.save(function (err, customer) {
		if (err) {
			respObj.success = false;
			if (err.name && err.name === "ValidationError") {
				respObj.response.msg = err.errors;
				respObj.statusCode = 400;
				res.status(respObj.statusCode).send(respObj);
			} else if (err.code === 11000) {
				respObj.response.msg = "This email is alreay in use now";
				respObj.statusCode = 409;
				res.status(respObj.statusCode).send(respObj);
			} else {
				next({
					'msg': 'Error registering new customer',
					'err': err
				});
			}
		} else {
			var response = Object.assign({}, customer.toObject(), {
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
	var userId = req.user._id;
	if (req.user.role_id.type === 'admin') {
		userId = req.params.customerId || userId;
	}
	Customers.findById(userId).where({
		'dwh_deleted': false
	}).select(Object.assign({}, config.technicalFields, {
		'password': 0
	})).populate({
		path: 'country',
		select: 'country'
	}).populate({
		path: 'role_id',
		select: '-_id name type'
	}).exec().then((obj) => {
		if (obj) {
			res.send(obj);
		} else {
			respObj.success = false;
			respObj.response.msg = "Customer not found";
			respObj.statusCode = 404;
			res.status(respObj.statusCode).send(respObj);
		}
	}).catch((err) => {
		next({
			'msg': 'Error occured',
			'err': err
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
	var userId = req.user._id,
		skipFields = Object.assign({}, config.technicalFields, {
			'password': 0,
			'role_id': 0
		});
	if (req.params.customerId && req.params.customerId !== req.user._id) {
		if (req.user.role_id.type === 'admin') {
			userId = req.params.customerId;
			delete skipFields.role_id;
		} else {
			respObj.success = false;
			respObj.response.msg = 'You are not authorized to perform this action';
			respObj.statusCode = 403;
			return res.status(respObj.statusCode).send(respObj);
		}
	}
	Customers.findOneAndUpdate({
		'_id': userId,
		'dwh_deleted': false
	}, {
		$set: req.body
	}, {
		fields: skipFields,
		runValidators: true
	}).then((obj) => {
		if (obj) {
			respObj.success = true;
			respObj.response.msg = "Information about customer was successfully updated";
			respObj.statusCode = 200;
		} else {
			respObj.success = false;
			respObj.response.msg = "Customer not found";
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

/**
 * Method is used to delete customer. Customer will not be deleted, just marked 'dwh_deleted' to 'true'
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.delete_customer = function (req, res, next) {
	var userId = req.user._id;
	if (req.params.customerId && req.params.customerId !== req.user._id) {
		if (req.user.role_id.type === 'admin') {
			userId = req.params.customerId;
		} else {
			respObj.success = false;
			respObj.response.msg = 'You are not authorized to perform this action';
			respObj.statusCode = 403;
			return res.status(respObj.statusCode).send(respObj);
		}
	}
	Customers.findOneAndUpdate({
		'_id': userId,
		'dwh_deleted': false
	}, {
		$set: {
			'dwh_deleted': true
		}
	}).then((obj) => {
		if (obj) {
			respObj.success = true;
			respObj.response.msg = "Customer successfully deleted";
			respObj.statusCode = 200;
		} else {
			respObj.success = false;
			respObj.response.msg = "Customer not found";
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

/**
 * Method is used to authenticate customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.authenticate_customer = function (req, res, next) {
	Customers.findOne({
			'email': req.body.email,
			'dwh_deleted': false
		})
		.select(config.technicalFields)
		.populate({
			path: 'role_id',
			select: '-_id name type'
		})
		.exec().then(function (customer) {
			if (!customer) {
				respObj.success = false;
				respObj.response.msg = "Authentication failed. Customer not found";
				respObj.statusCode = 403;
				res.status(respObj.statusCode).send(respObj);
			} else {
				// check if password matches
				customer.comparePassword(req.body.password, function (err, isMatch) {
					if (isMatch && !err) {
						// if customer is found and password is right create a token
						var dataToEncode = customer.toObject();
						delete dataToEncode.password;
						delete dataToEncode.address;
						delete dataToEncode.city;
						delete dataToEncode.zip_code;
						delete dataToEncode.role_id;

						var date = new Date();
						// add a day
						date.setDate(date.getDate() + 1);
						dataToEncode.validTo = date;
						var token = jwt.encode(dataToEncode, config.jwtSecret);
						// return the information including token as JSON
						var customerInfo = Object.assign({}, {
							success: true,
							token: 'JWT ' + token
						}, customer.toObject());
						delete customerInfo.password;
						res.send(customerInfo);
					} else {
						respObj.success = false;
						respObj.response.msg = "Authentication failed. Wrong password";
						respObj.statusCode = 403;
						res.status(respObj.statusCode).send(respObj);
					}
				});
			}
		}).catch(function (err) {
			next({
				'msg': 'Customer authorization error',
				'err': err
			});
		});
};

exports.change_password = function (req, res, next) {
	if (req.body.password) {
		Customers.findOne({
			'_id': req.user._id,
			'dwh_deleted': false
		}).exec().then((customer) => {
			customer.password = req.body.password;
			return customer.save();
		}).then(() => {
			respObj.success = true;
			respObj.response.msg = "Password was changed successfully";
			respObj.statusCode = 200;
			res.status(respObj.statusCode).send(respObj);
		}).catch((err) => {
			next({
				'msg': 'Error occured',
				'err': err
			})
		});
	} else {
		respObj.success = false;
		respObj.response.msg = "Password was not specified";
		respObj.statusCode = 400;
		res.status(respObj.statusCode).send(respObj);
	}
};

/**
 * Method is used to logout customer
 * @param  {Object} req Object containing information about the HTTP request
 * @param  {Object} res Object that is used to send back desired HTTP response
 * @param  {Function} next Function that passes control to the next matching route
 */
exports.logout_customer = function (req, res, next) {
	Customers.findOne({
			'email': req.user.email
		})
		.select(config.technicalFields)
		.exec(function (err, customer) {
			if (err) {
				return next({
					'msg': 'Error occured',
					'err': err
				});
			}
			if (!customer) {
				respObj.success = false;
				respObj.response.msg = "Logout failed. Customer not found";
				respObj.statusCode = 403;
				res.status(respObj.statusCode).send(respObj);
			} else {
				// check if password matches
				// if customer is found and password is right create a token
				var dataToEncode = customer.toObject();
				delete dataToEncode.password;
				delete dataToEncode.address;
				delete dataToEncode.city;
				delete dataToEncode.zip_code;
				delete dataToEncode.role_id;

				var date = new Date();
				// add a day
				dataToEncode.validTo = date;
				var token = jwt.encode(dataToEncode, config.jwtSecret);
				// return the information including token as JSON
				res.send({
					success: true,
					token: 'JWT ' + token
				});
			}
		});
};