'use strict';
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    Customers = require('../api/models/customers'),
    CountriesCities = require('../api/models/countriesCities'),
    Roles = require('../api/models/roles'),
    Products = require('../api/models/products.js'),

    chai = require('chai'),
    chaiHttp = require('chai-http'),

    server = require('../server'),
    config = require('config');

chai.use(chaiHttp).should();