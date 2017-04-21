var MongoClient = require('mongodb')
	.MongoClient,
	config = require('../../config/conf');



var insertCategories = function (db, callback) {
	var categories = db.collection('categories');
	categories.drop(function () {
		categories.insertMany([{
				"dwh_modified_date": new Date(),
				"dwh_created_date": new Date(),
				"name": "Electronics",
				"description": "Electronics",
				"subCategories": [{
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Cell phones",
					"description": "Cell phones"
				}, {
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Laptops",
					"description": "Laptops"
				}, {
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Tablets",
					"description": "Tablets"
				}],
				"__v": 0
			}, {
				"dwh_modified_date": new Date(),
				"dwh_created_date": new Date(),
				"name": "Home & Garden",
				"description": "Home & Garden",
				"subCategories": [{
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Home decor",
					"description": "Home decor"
				}, {
					"dwh_modified_date": new Date(),
					"dwh_created_date": new Date(),
					"name": "Tools",
					"description": "Tools"
				}],
				"__v": 0
			}],
			function (err, result) {
				if (err) {
					console.error(err);
				} else {
					console.log("Inserted a documents into the categories collection.");
					categories.createIndex({
						'name': 1,
						'subCategories.name': 1
					}, {
						unique: true
					}, function (err, result) {
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
