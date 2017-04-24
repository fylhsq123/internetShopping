'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CountriesCitiesSchema = new Schema({
	country: {
		type: String,
		required: true
	},
	cities: {
		type: Array,
		required: true
	}
});

module.exports = mongoose.model('CountriesCities', CountriesCitiesSchema);
