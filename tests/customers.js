'use strict';
process.env.NODE_ENV = 'test';
var mongoose = require('mongoose'),
    Customers = require('../api/models/customers'),

    chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http'),
    server = require('../server');

chai.use(chaiHttp);

describe('Customers', ()=>{
    describe('GET customers');
});