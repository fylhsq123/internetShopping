'use strict';
var MongoClient = require('mongodb')
	.MongoClient,
	ObjectId = require('mongodb')
	.ObjectID,
	config = require('../../config/conf');

var insertCategories = function (db, callback) {
	var categories = db.collection('categories');
	categories.drop(function () {
		categories.insertMany([{
					"_id": ObjectId("58fdb56d93c22716c88234c4"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Electronics",
					"description": "Electronics",
					"parent_id": ObjectId("000000000000000000000000")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234bf"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Cell phones",
					"description": "Cell phones",
					"parent_id": ObjectId("58fdb56d93c22716c88234c4")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234b1"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Smartphones",
					"description": "Smartphones",
					"parent_id": ObjectId("58fdb56d93c22716c88234bf")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234b2"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Accessories",
					"description": "Accessories",
					"parent_id": ObjectId("58fdb56d93c22716c88234bf")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234c0"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Laptops",
					"description": "Laptops",
					"parent_id": ObjectId("58fdb56d93c22716c88234c4")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234c1"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Tablets",
					"description": "Tablets",
					"parent_id": ObjectId("58fdb56d93c22716c88234c4")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234c5"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Home & Garden",
					"description": "Home & Garden",
					"parent_id": ObjectId("000000000000000000000000")
				},
				{
					"_id": ObjectId("58fdb56d93c22716c88234c2"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Home decor",
					"description": "Home decor",
					"parent_id": ObjectId("58fdb56d93c22716c88234c5")
				}, {
					"_id": ObjectId("58fdb56d93c22716c88234c3"),
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Tools",
					"description": "Tools",
					"parent_id": ObjectId("58fdb56d93c22716c88234c5")
				}
			],
			function (err) {
				if (err) {
					console.error(err);
				} else {
					console.log("Inserted a documents into the categories collection.");
					categories.createIndex({
						'name': 1
					}, {
						unique: true
					}, function (err) {
						if (err) {
							console.error(err);
						} else {
							console.info("Created unique index for categories collection.");
							callback();
						}
					});
				}
			});
	});
};

MongoClient.connect(config.database, function (err, db) {
	if (err) {
		console.error(err);
	} else {
		insertCategories(db, function () {
			db.close();
		});
	}
});