'use strict';
var cryptiles = require('cryptiles');

module.exports = {
	'server': {
		'address': '192.168.2.65',
		'port': '3001',
		'host': function () {
			return this.address + ':' + this.port;
		}
	},
	'upload_dir': './uploads/',
	'database': 'mongodb://localhost:27017/internetShopping',
	'technicalFields': {
		'__v': 0,
		'dwh_deleted': 0,
		'dwh_created_date': 0,
		'dwh_modified_date': 0,
		'dwh_online': 0,
		'personal_key': 0
	},
	'jwtSecret': cryptiles.randomString(64),
	'jwtSession': {
		session: false
	},
	'eventNameForNewProduct': 'news'
};