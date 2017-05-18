'use strict';
var cryptiles = require('cryptiles'),
	mongoose = require('mongoose');

module.exports = {
	'server': {
		'address': '192.168.2.65',
		'port': '3005',
		'host': function () {
			return this.address + ':' + this.port;
		}
	},
	'upload_dir': './uploads/test/',
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
			"dwh_deleted": false,
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
	}],
	'testFile': {
		'name': 'test1.txt',
		'content': 'Hello'
	},
	'testImageFile': {
		'name': 'test1.png',
		'content': 'Hello'
	},
	'categories': [{
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c4"),
		"name": "Category_01",
		"description": "Category_01 description",
		"parent_id": mongoose.Types.ObjectId("000000000000000000000000")
	}, {
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234bf"),
		"name": "SubCategory_11",
		"description": "SubCategory_11 description",
		"parent_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c4")
	}, {
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c0"),
		"name": "SubCategory_12",
		"description": "SubCategory_12 description",
		"parent_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c4")
	}, {
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c1"),
		"name": "SubCategory_13",
		"description": "SubCategory_13 description",
		"parent_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c4")
	}, {
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c5"),
		"name": "Category_02",
		"description": "Category_02 description",
		"parent_id": mongoose.Types.ObjectId("000000000000000000000000")
	}, {
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c2"),
		"name": "SubCategory_21",
		"description": "SubCategory_21 description",
		"parent_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c5")
	}, {
		"_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c3"),
		"name": "SubCategory_22",
		"description": "SubCategory_22 description",
		"parent_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c5")
	}],
	'products': [{
		"_id": mongoose.Types.ObjectId("58ff577e8cceae2904475c6a"),
		"name": "Test product 1",
		"description": "Test product 1 description",
		"image": "test1.jpg",
		"subcategory_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234bf"),
		"seller_id": mongoose.Types.ObjectId("58f60aef2878a22f6824f09f"),
		"price_sold": 230.24234,
		"price_bought": 100.234,
		"count_sold": 3,
		"count_bought": 10,
	}, {
		"_id": mongoose.Types.ObjectId("58ff59900981bf1f5477fa66"),
		"name": "Test product 2",
		"description": "Test product 2 description",
		"image": "test2.jpg",
		"subcategory_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234bf"),
		"seller_id": mongoose.Types.ObjectId("58f60aef2878a22f6824f09f"),
		"price_sold": 2300.24234,
		"price_bought": 1000.234,
		"count_sold": 30,
		"count_bought": 100,
	}, {
		"_id": mongoose.Types.ObjectId("58ff5a100981bf1f5477fa67"),
		"name": "Test product 3",
		"description": "Test product 3 description",
		"image": "test3.jpg",
		"subcategory_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234bf"),
		"seller_id": mongoose.Types.ObjectId("58f5d9463194692fc8fe0b63"),
		"price_sold": 23000.24234,
		"price_bought": 10000.234,
		"count_sold": 300,
		"count_bought": 1000,
	}, {
		"_id": mongoose.Types.ObjectId("59009df29cf77d3a40479fda"),
		"name": "Test product 4",
		"description": "Test product 4 description",
		"image": "test4.jpg",
		"subcategory_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c3"),
		"seller_id": mongoose.Types.ObjectId("58f60aef2878a22f6824f09f"),
		"price_sold": 230000.24234,
		"price_bought": 100000.234,
		"count_sold": 3000,
		"count_bought": 10000,
	}, {
		"_id": mongoose.Types.ObjectId("59033e61d4180e2904b335ac"),
		"name": "Test product 5",
		"description": "Test product 5 description",
		"image": "",
		"subcategory_id": mongoose.Types.ObjectId("58fdb56d93c22716c88234c3"),
		"seller_id": mongoose.Types.ObjectId("58f5d9463194692fc8fe0b63"),
		"price_sold": 2300000.24234,
		"price_bought": 100000.234,
		"count_sold": 30000,
		"count_bought": 30000,
	}]
};