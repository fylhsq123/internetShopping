'use strict';

var mongoose = require('mongoose'),
	CountriesCities = mongoose.model('CountriesCities');

exports.list_all_countries = function (req, res) {
	CountriesCities.find({}, 'country', function (err, countries) {
		if (err) {
			console.error(err);
			res.send({
				"success": false,
				"response": {
					"msg": "Error reading countries"
				}
			});
		}
		res.json(countries);
	});
};

exports.list_all_cities = function (req, res) {
	CountriesCities.findById({
		"_id": req.params.countryId
	}, 'cities', function (err, cities) {
		if (err) {
			console.error(err);
			res.send({
				"success": false,
				"response": {
					"msg": "Error reading cities"
				}
			});
		}
		res.json(cities);
	});
};
