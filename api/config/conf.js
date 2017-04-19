const cryptiles = require('cryptiles');

module.exports = {
	'database': 'mongodb://localhost:27017/internetShopping',
	'technicalFields': {
		'password': 0,
		'__v': 0,
		'dwh_deleted': 0,
		'dwh_created_date': 0,
		'dwh_modified_date': 0,
		'personal_key': 0
		// '_id': 0		// TODO Uncomment this line before testing!!! (just for development)
	},
	'jwtSecret': cryptiles.randomString(64),
	//'jwtSecret': "cryptiles.randomString(64)",
	'jwtSession': {
		session: false
	}
};
