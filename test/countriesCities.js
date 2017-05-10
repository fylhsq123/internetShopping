'use strict';
process.env.NODE_ENV = 'test';
var /*mongoose = require('mongoose'),*/
    CountriesCities = require('../api/models/countriesCities.js'),

    chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http'),
    chaiAsPromised = require('chai-as-promised'),
    server = require('../server'),
    config = require('config'),
    countryId = config.countries[0]._id;

chai.use(chaiHttp).use(chaiAsPromised);

describe('CountriesCities', () => {
    beforeEach(() => {
        return CountriesCities.remove({}).then(() => {
            return CountriesCities.insertMany(config.countries);
        });
    });
    describe('GET countries', () => {
        it('should get all the countries', (done) => {
            chai.request(server).get('/countries').end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(config.countries.length);
                done();
            });
        });
    });
    describe('GET cities', () => {
        it('should get all the cities that are related to cpecified country', (done) => {
            chai.request(server).get('/cities/' + countryId).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.not.be.empty;
                res.body.should.have.property('cities');
                res.body.cities.should.be.a('array');
                res.body.cities.should.have.length(config.countries[0].cities.length);
                done();
            });
        });
        it('should respond with NULL if specified ID does not exist', (done) => {
            chai.request(server).get('/cities/59104585c976ad5a5c0a7cd1').end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                should.not.exist(res.body);
                done();
            });
        });
        it('should throw error 500 if wrong ID was specified', (done) => {
            chai.request(server).get('/cities/SomeWrongID').end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                done();
            });
        });
    });
});