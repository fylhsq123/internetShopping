'use strict';
module.exports = function (app) {
	var countriesCities = require('../controllers/countriesCities');

	// countries Routes
	app.route('/countries')
		.get(countriesCities.list_all_countries);

	// cities Routes
	app.route('/cities/:countryId')
		.get(countriesCities.list_all_cities);
};
