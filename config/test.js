'use strict';
var cryptiles = require('cryptiles');

module.exports = {
	'server': {
		'address': '192.168.2.65',
		'port': '3005'
	},
	'upload_dir': './tests/uploads/',
	'database': 'mongodb://localhost:27017/internetShopping_test',
	'jwtSecret': cryptiles.randomString(64)
};
