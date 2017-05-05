'use strict';

module.exports = function (app, passport) {
	var customers = require('../controllers/customers'),
		config = require('config');

	/**
	 * Create new customer or list all customers
	 */
	app.route('/customers')
		.get(passport.authenticate('jwt', config.jwtSession), customers.list_all_customers)
		.post(customers.create_customer);

	/**
	 * Customer authentication methods
	 */
	app.route('/authenticate')
		.post(customers.authenticate_customer);
	app.route('/logout')
		.get(passport.authenticate('jwt', config.jwtSession), customers.logout_customer);

	/**
	 * Get / update / delete information about customer
	 */
	app.route(['/customer', '/customer/:customerId'])
		.get(passport.authenticate('jwt', config.jwtSession), customers.read_customer_info)
		.put(passport.authenticate('jwt', config.jwtSession), customers.update_customer)
		.delete(passport.authenticate('jwt', config.jwtSession), customers.delete_customer);
};