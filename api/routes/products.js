'use strict';

module.exports = function (app, passport) {
    var products = require('../controllers/products.js'),
        config = require('../config/conf.js');

    app.route('/products')
        .get(products.list_all_products)
        .post(passport.authenticate('jwt', config.jwtSession), products.create_new_product);

    app.route(['/products/bysubcategory/:subcategoryId/:sortBy/:sortOrder', '/products/bysubcategory/:subcategoryId'])
        .get(products.list_all_products);
    app.route(['/products/byseller/:sellerId/:sortBy/:sortOrder', '/products/byseller/:sellerId'])
        .get(products.list_all_products);
    app.route(['/products/bysellerandsubcategory/:sellerId/:subcategoryId/:sortBy/:sortOrder', '/products/bysellerandsubcategory/:sellerId/:subcategoryId'])
        .get(products.list_all_products);

    app.route('/products/:productId')
        .get(products.read_general_product_info);

    app.route('/product/:productId')
        .get(passport.authenticate('jwt', config.jwtSession), products.read_product_info)
        .put(passport.authenticate('jwt', config.jwtSession), products.update_product_info)
        .delete(passport.authenticate('jwt', config.jwtSession), products.delete_product_info);
};