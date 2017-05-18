module.exports = {
	'server': {
		'address': '192.168.2.65',
		'port': '3000',
		'host': function () {
			return this.address + ':' + this.port;
		}
	},
	'upload_dir': './uploads/dev',
	'database': 'mongodb://localhost:27017/internetShopping',
	'jwtSecret': 'cryptiles.randomString(64)'
}