'use strict';

module.exports = function (app) {
    var common = require('../controllers/common.js');

    app.route('/sources/:sourceId')
        .get(common.load_source);
};