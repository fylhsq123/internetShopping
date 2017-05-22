'use strict';

module.exports = function (app, passport) {
    var orders = require('../controllers/orders'),
        config = require('config');

    app.route('/order')
        .post(passport.authenticate('jwt', config.jwtSession), orders.make_order);

};