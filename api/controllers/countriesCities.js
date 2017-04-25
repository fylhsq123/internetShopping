'use strict';

var mongoose = require('mongoose'),
	CountriesCities = mongoose.model('CountriesCities');

exports.list_all_countries = function (req, res, next) {
	CountriesCities.find({}, 'country', function (err, countries) {
		if (err) {
			next({
				'msg': 'Error reading countries',
				'err': err
			});
		} else {
			res.json(countries);
		}
	});
};

exports.list_all_cities = function (req, res, next) {
	CountriesCities.findById({
		"_id": req.params.countryId
	}, 'cities', function (err, cities) {
		if (err) {
			next({
				'msg': 'Error reading cities',
				'err': err
			});
		} else {
			res.json(cities);
		}
	});
};