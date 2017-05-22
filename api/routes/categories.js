'use strict';

module.exports = function (app) {
	var categories = require('../controllers/categories');

	// countries Routes
	// app.route('/categories2')
	// 	.get(categories.list_all_categoies2);
	// app.route('/categories1')
	// 	.get(categories.list_all_categoies1);
	app.route('/categories')
		.get(categories.list_all_categoies);

	// cities Routes
	app.route('/subcategories/:categoryId')
		.get(categories.list_all_subcategoies);
};