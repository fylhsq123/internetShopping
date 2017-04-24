'use strict';

var mongoose = require('mongoose'),
	Categories = mongoose.model('Categories');

exports.list_all_categoies = function (req, res, next) {
	Categories.find({}, '_id name subCategories._id subCategories.name', function (err, categories) {
		if (err) {
			next({
				'msg': 'Error reading categories',
				'err': err
			});
		} else {
			res.json(categories);
		}
	});
};

exports.list_all_subcategoies = function (req, res, next) {
	Categories.findById({
		"_id": req.params.categoryId
	}, 'subCategories.name', function (err, subCategories) {
		if (err) {
			next({
				'msg': 'Error reading subcategories',
				'err': err
			});
		} else {
			res.json(subCategories);
		}
	});
};
