'use strict';
module.exports = function (app, passport) {
	var categories = require('../controllers/categories');

	// countries Routes
	app.route('/categories')
		.get(categories.list_all_categoies);

	// cities Routes
	app.route('/subcategories/:categoryId')
		.get(categories.list_all_subcategoies);
};
