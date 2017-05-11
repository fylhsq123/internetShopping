'use strict';
var cryptiles = require('cryptiles'),
	mongoose = require('mongoose');

module.exports = {
	'server': {
		'address': '192.168.2.65',
		'port': '3005'
	},
	'upload_dir': './tests/uploads/',
	'database': 'mongodb://localhost:27017/internetShopping_test',
	'jwtSecret': cryptiles.randomString(64),
	// fake customers for testing
	'customers': {
		'admin': {
			"_id": mongoose.Types.ObjectId("58f5d9463194692fc8fe0b63"),
			"email": "admin@test.com",
			"password": "$2a$10$lJjJAmwyfoMwBU5n1e4wMOFby1AAmxcH3eyP/HL0xNdiz4PeISBAS",
			'password_unhashed': 'test123',
			"zip_code": "81121",
			"city": "City_21",
			"address": "Zelena st., 33",
			"phone_number": "0933798877",
			"last_name": "TestSurname1",
			"first_name": "TestName1",
			"dwh_deleted": false,
			"country": mongoose.Types.ObjectId("59104585c976ad5a5c0a7cd9"),
			"role_id": mongoose.Types.ObjectId("58fdf33d746c70e8a1759a39")
		},
		'seller': {
			"_id": mongoose.Types.ObjectId("58f60aef2878a22f6824f09f"),
			"email": "seller@test.com",
			"password": "$2a$10$lJjJAmwyfoMwBU5n1e4wMOFby1AAmxcH3eyP/HL0xNdiz4PeISBAS",
			'password_unhashed': 'test123',
			"zip_code": "81133",
			"city": "City_21",
			"address": "Shevchenka st., 17",
			"phone_number": "0633945475",
			"last_name": "TestSurname2",
			"first_name": "TestName2",
			"dwh_deleted": false,
			"country": mongoose.Types.ObjectId("59104585c976ad5a5c0a7cd9"),
			"role_id": mongoose.Types.ObjectId("58fdf379746c70e8a1759a5b")
		},
		'buyer': {
			"_id": mongoose.Types.ObjectId("58f60aef2878a22f6824f09e"),
			"email": "buyer@test.com",
			"password": "$2a$10$rRL94feBshHwN7wTbHJ1u.wGBBvoQNXBG33XgYNfgsKBoiX4dcu7.",
			'password_unhashed': 'test123',
			"zip_code": "81133",
			"city": "City_11",
			"address": "Shevchenka st., 17",
			"phone_number": "0639347288",
			"last_name": "TestSurname3",
			"first_name": "TestName3",
			"dwh_deleted": true,
			"country": mongoose.Types.ObjectId("59104585c976ad5a5c0a7cd8"),
			"role_id": mongoose.Types.ObjectId("58fdf368746c70e8a1759a55")
		}
	},
	// fake countires for testing
	'countries': [{
		"_id": mongoose.Types.ObjectId("59104585c976ad5a5c0a7cd8"),
		"country": "Country_1",
		"cities": ["City_11", "City_12", "City_13"]
	}, {
		"_id": mongoose.Types.ObjectId("59104585c976ad5a5c0a7cd9"),
		"country": "Country_2",
		"cities": ["City_21"]
	}],
	'roles': [{
		"_id": mongoose.Types.ObjectId("58fdf33d746c70e8a1759a39"),
		"name": "Administrator",
		"type": "admin"
	}, {
		"_id": mongoose.Types.ObjectId("58fdf368746c70e8a1759a55"),
		"name": "Products Buyer",
		"type": "buyer"
	}, {
		"_id": mongoose.Types.ObjectId("58fdf379746c70e8a1759a5b"),
		"name": "Products Seller",
		"type": "seller"
	}]
};