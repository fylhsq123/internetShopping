'use strict';

module.exports = function (app, passport) {
    var orders = require('../controllers/orders'),
        config = require('config');

    app.route('/orders')
        .get(passport.authenticate('jwt', config.jwtSession), orders.list_orders)
        .post(passport.authenticate('jwt', config.jwtSession), orders.make_order);
    app.route('/orders/:orderId')
        .get(passport.authenticate('jwt', config.jwtSession), orders.get_order)
        .put(passport.authenticate('jwt', config.jwtSession), orders.update_order)
        .delete(passport.authenticate('jwt', config.jwtSession), orders.delete_order);
};