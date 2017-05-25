'use strict';

module.exports = function (app, passport) {
    var products = require('../controllers/products.js'),
        config = require('config');

    /**
     * Additional query parameters are aceptable
     * @param {ObjectID} seller Specifies seller ID that will be used for filtering
     * @param {ObjectID} subcategory Specifies subcategory ID that will be used for filtering
     * @param {String} sort Name of filed that will be used in sorting
     * @param {String} order Sort order [asc|desc] (if 'sort' is specified, 'asc' is default sort order)
     * @param {ObjectID} lastid ID of the last element in a list (if not specified it will load first 'limit' elements or all elements if limit is not specified)
     * @param {String} lastval value of a field that is used in sorting (if not specified 'lastid' will be used instead)
     * @param {Number} limit Number of items that will be displayed (if not specified it will load elements without limitation)
     */
    app.route(['/products', '/products/:productId'])
        .get(products.list_all_products);

    app.route('/product')
        .post(passport.authenticate('jwt', config.jwtSession), products.create_new_product);

    app.route('/product/:productId')
        .get(passport.authenticate('jwt', config.jwtSession), products.read_product_info)
        .put(passport.authenticate('jwt', config.jwtSession), products.update_product_info)
        .delete(passport.authenticate('jwt', config.jwtSession), products.delete_product_info);
};