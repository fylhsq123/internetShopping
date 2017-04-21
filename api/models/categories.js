'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var subCategoriesSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	}
});

var CategoriesSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	subCategories: [subCategoriesSchema]
}, {
	timestamps: {
		createdAt: 'dwh_created_date',
		updatedAt: 'dwh_modified_date'
	}
});

module.exports = mongoose.model('Categories', CategoriesSchema);
