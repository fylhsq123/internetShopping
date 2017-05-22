'use strict';

var mongoose = require('mongoose'),
	Promise = require("bluebird"),
	Categories = mongoose.model('Categories'),
	respObj = {
		"success": false,
		"response": {
			"msg": ""
		}
	};

// exports.list_all_categoies1 = function (req, res, next) {
// 	var catHierarchy = [];

// 	function list_cat(parent_id) {
// 		var new_promise = new Promise(function (resolve, reject) {
// 			var promises = [];
// 			Categories.find({
// 					parent_id: parent_id
// 				})
// 				.select('_id name description parent_id')
// 				.exec(function (err, categories) {
// 					if (err) {
// 						reject({
// 							'msg': 'Error reading categories',
// 							'err': err
// 						});
// 					} else {
// 						var categoriesLen = categories.length;
// 						if (categoriesLen > 0) {
// 							for (var index = 0; index < categoriesLen; index++) {
// 								var category = categories[index];
// 								//console.log("category", category);
// 								list_cat(category._id).then(function (children) {
// 									resolve();
// 									console.log("children", children);
// 									return new_promise;
// 								});
// 								// promises.push(list_cat(category._id).then(function (children) {
// 								// 	console.log("children", children);
// 								// 	resolve(categories);
// 								// }).catch(function (err) {
// 								// 	//reject();
// 								// }));
// 							}
// 						} else {
// 							resolve(categories);
// 						}
// 						//Promise.all(promises).then(resolve);
// 					}
// 				});
// 		});
// 		return new_promise;
// 	}
// 	list_cat("000000000000000000000000").then(function (obj) {
// 		console.log(obj);
// 		res.json(obj);
// 	}).catch(function (err) {
// 		next(err);
// 	});
// };

// exports.list_all_categoies2 = function (req, res) {
// 	var promises = [];

// 	function get_categories(parent) {
// 		var new_promise = new Promise(function (resolve, reject) {
// 			Categories.find({
// 					parent_id: parent._id
// 				})
// 				.select('_id name description parent_id')
// 				.exec(function (err, categories) {
// 					if (err) {
// 						reject({
// 							'msg': 'Error reading categories',
// 							'err': err
// 						});
// 					} else {
// 						var categoriesObjs = [];
// 						for (var i in categories) {
// 							categoriesObjs.push(categories[i].toObject());
// 						}
// 						resolve({
// 							parent: parent,
// 							categories: categoriesObjs
// 						});
// 					}
// 				});
// 		}).then((obj) => {
// 			var categoriesLen = obj.categories.length;
// 			if (categoriesLen > 0) {
// 				Object.assign(obj.parent, {
// 					child: obj.categories
// 				});
// 				console.log(obj.parent);
// 				for (var i = 0; i < categoriesLen; i++) {
// 					var category = obj.parent.child[i];
// 					return get_categories(category);
// 				}
// 			}
// 		});
// 		promises.push(new_promise);
// 		return new_promise;
// 	}
// 	var catHierarchy = {
// 		_id: "000000000000000000000000"
// 	};
// 	get_categories(catHierarchy);
// 	Promise.all(promises).then(function () {
// 		console.log("catHierarchy => ", catHierarchy);
// 		res.send(catHierarchy);
// 	});
// };

exports.list_all_categoies = function (req, res, next) {
	Categories.find({})
		.select('_id name description parent_id')
		.exec(function (err, categories) {
			if (err) {
				next({
					'msg': 'Error reading categories',
					'err': err
				});
			} else {
				var result = [],
					list_categories = function (parent_id) {
						var list = categories.filter(function (item) {
							return item.parent_id.toString() == parent_id.toString();
						});
						if (list.length > 0) {
							for (var i in list) {
								list[i] = Object.assign({}, list[i].toObject(), {
									"subCategories": list_categories(list[i]._id)
								});
							}
						}
						return list;
					};
				result = list_categories("000000000000000000000000");
				res.json(result);
			}
		});
};

exports.list_all_subcategoies = function (req, res, next) {
	Categories.find({
		"parent_id": req.params.categoryId
	}).select('_id name description parent_id').populate('parent', '_id name description').exec(function (err, subCategories) {
		if (err) {
			next({
				'msg': 'Error reading subcategories',
				'err': err
			});
		} else {
			if (subCategories.length) {
				res.json(subCategories);
			} else {
				respObj.success = false;
				respObj.response.msg = "Subcategories were not found";
				respObj.statusCode = 404;
				res.status(respObj.statusCode).send(respObj);
			}
		}
	});
};