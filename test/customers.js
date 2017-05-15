'use strict';
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    Customers = require('../api/models/customers'),
    CountriesCities = require('../api/models/countriesCities'),
    Roles = require('../api/models/roles'),

    chai = require('chai'),
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
chai.should();
mongoose.Promise = global.Promise;
chai.use(chaiHttp).use(chaiAsPromised);

describe('Customers', () => {
    var authorizationAdmin, authorizationSeller,
        customersArr = [config.customers.admin, config.customers.seller, config.customers.buyer];
    before('Load data into related tables', () => {
        return CountriesCities.remove({}).then(() => {
            return CountriesCities.insertMany(config.countries);
        }).then(() => {
            return Roles.remove({}).then(() => {
                return Roles.insertMany(config.roles);
            });
        });
    });
    beforeEach('Clean up Customers collection before each test', () => {
        return Customers.remove({}).then(() => {
            return Customers.insertMany(customersArr);
        });
    });
    beforeEach('authenticate admin', (done) => {
        chai.request(server).post('/authenticate').send({
            email: config.customers.admin.email,
            password: config.customers.admin.password_unhashed
        }).end((err, res) => {
            if (err) return done(err);
            authorizationAdmin = res.body.token;
            done();
        });
    });
    beforeEach('authenticate seller', (done) => {
        chai.request(server).post('/authenticate').send({
            email: config.customers.seller.email,
            password: config.customers.seller.password_unhashed
        }).end((err, res) => {
            if (err) return done(err);
            authorizationSeller = res.body.token;
            done();
        });
    });

    describe('Creating new customer', () => {
        it('should create new customer with correct input data', (done) => {
            chai.request(server).post('/customers').send(testCorrectCustomer).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(201);
                res.body.email.should.equal(testCorrectCustomer.email);
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
        it('should be possible to login', (done) => {
            chai.request(server).post('/authenticate').send({
                email: config.customers.admin.email,
                password: config.customers.admin.password_unhashed
            }).end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it('should not login if email is not registered', (done) => {
            chai.request(server).post('/authenticate').send({
                email: 'wrongEmail',
                password: config.customers.admin.password_unhashed
            }).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('should not login if password is incorrect', (done) => {
            chai.request(server).post('/authenticate').send({
                email: config.customers.admin.email,
                password: 'wrongPassword'
            }).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
    });

    describe('Listing all customers', () => {
        it('should list all customers for administrator', (done) => {
            chai.request(server).get('/customers').set("Authorization", authorizationAdmin).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.should.have.length(customersArr.length);
                done();
            });
        });
        it('should not list customers for non-admin user', (done) => {
            chai.request(server).get('/customers').set("Authorization", authorizationSeller).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should not list customer for unauthorized user', (done) => {
            chai.request(server).get('/customers').end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });
    });

    describe('Read information about customer', () => {
        it('should be possible that customer could read information about himself', (done) => {
            chai.request(server).get('/customer').set("Authorization", authorizationAdmin).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.email.should.be.equal(config.customers.admin.email);
                done();
            });
        });
        it('should be possible to read information about any customer by administrator', (done) => {
            chai.request(server).get('/customer/' + config.customers.seller._id).set("Authorization", authorizationAdmin).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.email.should.be.equal(config.customers.seller.email);
                done();
            });
        });
        it('should not be possible to read information about customer by some other seller or buyer', (done) => {
            chai.request(server).get('/customer/' + config.customers.admin._id).set("Authorization", authorizationSeller).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.email.should.not.be.equal(config.customers.admin.email);
                done();
            });
        });
        it('should not be possible to read information about any customer by unauthorized user', (done) => {
            chai.request(server).get('/customer/' + config.customers.seller._id).end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });
        it('should not be possible to read information about not existing customer by administrator', (done) => {
            chai.request(server).get('/customer/58f5d9463194692fc8fe3c63').set("Authorization", authorizationAdmin).end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should throw error if customer ID is not valid', (done) => {
            chai.request(server).get('/customer/SomeWrongID').set("Authorization", authorizationAdmin).end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });
    describe('Update information about customer', () => {
        it('should be possible to update information about customer by himself', (done) => {
            chai.request(server).put('/customer').set("Authorization", authorizationSeller).send(testCorrectCustomer).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                Customers.findById(config.customers.seller._id).exec((err, res) => {
                    if (err) return done(err);
                    res.email.should.be.equal(testCorrectCustomer.email);
                    done();
                });
                // Customers.findById(config.customers.seller._id).exec().should.eventually.equal(testCorrectCustomer.email).notify(done);
            });
        });
        it('should be possible to update information about any customer by administrator', (done) => {
            chai.request(server).put('/customer/' + config.customers.seller._id).set("Authorization", authorizationAdmin).send(testCorrectCustomer).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                Customers.findById(config.customers.seller._id).exec((err, res) => {
                    if (err) return done(err);
                    res.email.should.be.equal(testCorrectCustomer.email);
                    done();
                });
            });
        });
        it('should not be possible to update information about customer by some other seller or buyer', (done) => {
            chai.request(server).put('/customer/' + config.customers.admin._id).set("Authorization", authorizationSeller).send(testCorrectCustomer).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('should not be possible to update information about any customer by unauthorized user', (done) => {
            chai.request(server).put('/customer/' + config.customers.admin._id).send(testCorrectCustomer).end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });
        it('should not be possible to update information about not existing customer by administrator', (done) => {
            chai.request(server).put('/customer/58f5d9463194692fc8fe3c63').set("Authorization", authorizationAdmin).send(testCorrectCustomer).end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should throw an error if customer ID is not valid', (done) => {
            chai.request(server).put('/customer/SomeWrongID').set("Authorization", authorizationAdmin).send(testCorrectCustomer).end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
        it('should throw an error if data is incorrect', (done) => {
            chai.request(server).put('/customer').set("Authorization", authorizationSeller).send(testIncorrectCustomer).end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });
    describe('Deleting information about customers', () => {
        it('should be possible that customer could delete information about himself', (done) => {
            chai.request(server).delete('/customer').set("Authorization", authorizationSeller).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                Customers.findById(config.customers.seller._id).exec((err, res) => {
                    if (err) return done(err);
                    res.dwh_deleted.should.be.equal(true);
                    done();
                });
            });
        });
        it('should be possible to delete information about any customer by administrator', (done) => {
            chai.request(server).delete('/customer/' + config.customers.seller._id).set("Authorization", authorizationAdmin).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                Customers.findById(config.customers.seller._id).exec((err, res) => {
                    if (err) return done(err);
                    res.dwh_deleted.should.be.equal(true);
                    done();
                });
            });
        });
        it('should not be possible to delete information about customer by some other seller or buyer', (done) => {
            chai.request(server).delete('/customer/' + config.customers.admin._id).set("Authorization", authorizationSeller).end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });
        it('should not be possible to delete information about any customer by unauthorized user', (done) => {
            chai.request(server).delete('/customer/' + config.customers.admin._id).end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });
        it('should not be possible to delete information about not existing customer by administrator', (done) => {
            chai.request(server).delete('/customer/58f5d9463194692fc8fe3c63').set("Authorization", authorizationAdmin).end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should throw an error if customer ID is not valid', (done) => {
            chai.request(server).delete('/customer/SomeWrongID').set("Authorization", authorizationAdmin).end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });

    after('Delete all data', () => {
        return CountriesCities.remove({}).then(() => {
            return Roles.remove({});
        }).then(() => {
            return Customers.remove({});
        });
    });
});