'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var RolesSchema = new Schema({
	type: {
		type: String,
		required: true
	}
}, {
	timestamps: {
		createdAt: 'dwh_created_date',
		updatedAt: 'dwh_modified_date'
	}
});

module.exports = mongoose.model('Roles', RolesSchema);
