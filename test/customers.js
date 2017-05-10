'use strict';
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    Customers = require('../api/models/customers'),
    CountriesCities = require('../api/models/countriesCities.js'),

    chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http'),
    chaiAsPromised = require('chai-as-promised'),
    server = require('../server'),
    config = require('config'),
    testCorrectCustomer = {
        "email": "TestName.TestSurname@test.com",
        "password": "test123",
        "zip_code": "81188",
        "city": "Lviv",
        "address": "Chonovola st., 37",
        "phone_number": "0633945555",
        "last_name": "TestSurname",
        "first_name": "TestName",
        "country": mongoose.Types.ObjectId("58f0d7c6716e0f67441b0b05"),
        "role_id": mongoose.Types.ObjectId("58fdf368746c70e8a1759a55")
    },
    testIncorrectCustomer = {
        "email": "TestName4.TestSurname4",
        "password": "",
        "phone_number": "0633AAA555",
        "last_name": "",
        "first_name": ""
    };

chai.use(chaiHttp).use(chaiAsPromised);

describe('Customers', () => {
    beforeEach(() => {
        return Customers.remove({})
            .then(() => {
                return Customers.insertMany(config.customers);
            })
            .then(() => {
                return CountriesCities.remove({}).then(() => {
                    return CountriesCities.insertMany(config.countries);
                });
            });
    });

    describe('Creating new customer', () => {
        it('should create new customer with correct input data', (done) => {
            chai.request(server).post('/customers').send(testCorrectCustomer).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(201);
                res.body.email.should.equal(testCorrectCustomer.email);
                res.body.first_name.should.equal(testCorrectCustomer.first_name);
                done();
            });
        });
        it('should throw an error if creating customer with empty/wrong required fields', (done) => {
            chai.request(server).post('/customers').send(testIncorrectCustomer).end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
        it('should be unable to register one user two times', (done) => {
            chai.request(server).post('/customers').send(testCorrectCustomer).end((err) => {
                if (err) return done(err);
                chai.request(server).post('/customers').send(testCorrectCustomer).end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
            });
        });
    });
    describe('Customer authorization', () => {
        beforeEach('register customer', (done) => {
            chai.request(server).post('/customers').send(testCorrectCustomer).end((err) => {
                if (err) return done(err);
                done();
            });
        });
        it('should be possible to login', (done) => {
            chai.request(server).post('/authenticate').send({
                email: testCorrectCustomer.email,
                password: testCorrectCustomer.password
            }).end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it('should not login if email is not registered', (done) => {
            chai.request(server).post('/authenticate').send({
                email: 'wrong' + testCorrectCustomer.email,
                password: testCorrectCustomer.password
            }).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('should not login if password is incorrect', (done) => {
            chai.request(server).post('/authenticate').send({
                email: testCorrectCustomer.email,
                password: 'wrong' + testCorrectCustomer.password
            }).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
    });
});