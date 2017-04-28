'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CategoriesSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	parent_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Categories'
	}
}, {
	timestamps: {
		createdAt: 'dwh_created_date',
		updatedAt: 'dwh_modified_date'
	},
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

CategoriesSchema.virtual('parent', {
	ref: 'Categories',
	localField: 'parent_id',
	foreignField: '_id'
});

CategoriesSchema.virtual('children', {
	ref: 'Categories',
	localField: '_id',
	foreignField: 'parent_id'
});

module.exports = mongoose.model('Categories', CategoriesSchema);