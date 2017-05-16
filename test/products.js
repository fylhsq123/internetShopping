'use strict';
process.env.NODE_ENV = 'test';

var Customers = require('../api/models/customers'),
    CountriesCities = require('../api/models/countriesCities'),
    Roles = require('../api/models/roles'),
    Products = require('../api/models/products'),
    Categories = require('../api/models/categories'),

    chai = require('chai'),
    chaiHttp = require('chai-http'),

    server = require('../server'),
    config = require('config');

chai.use(chaiHttp).should();

describe('Products', () => {
    var authorizationAdmin, authorizationSeller,
        customersArr = [config.customers.admin, config.customers.seller, config.customers.buyer];

    before('Load data into related tables', () => {
        return Customers.remove({}).then(() => {
            return Customers.insertMany(customersArr);
        }).then(() => {
            return Roles.remove({}).then(() => {
                return Roles.insertMany(config.roles);
            });
        }).then(() => {
            return CountriesCities.remove({}).then(() => {
                return CountriesCities.insertMany(config.countries);
            });
        }).then(() => {
            return Categories.remove({}).then(() => {
                return Categories.insertMany(config.categories);
            });
        });
    });
    beforeEach('Load products', () => {
        return Products.remove({}).then(() => {
            return Products.insertMany(config.products);
        });
    });

    describe('Products listing', () => {
        describe('all products', () => {
            it('should be possible to list all products', (done) => {
                chai.request(server).get('/products').end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.have.length(config.products.length);
                    done();
                });
            });
        });
        describe('products by seller', () => {
            it('should be possible to list all products that belong to specified seller', (done) => {
                chai.request(server).get('/products/byseller/' + config.customers.seller._id).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsLen = config.products.filter((elem) => {
                        return elem.seller_id.toString() == config.customers.seller._id.toString();
                    }).length;
                    res.body.should.have.length(productsLen);
                    done();
                });
            });
            it('should be possible to list all products that belong to specified seller in descending order by name', (done) => {
                chai.request(server).get('/products/byseller/' + config.customers.seller._id + '/name/desc').end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsSorted = config.products.filter((elem) => {
                        return elem.seller_id.toString() == config.customers.seller._id.toString();
                    }).sort((a, b) => {
                        return a.name < b.name ? 1 : -1;
                    });
                    res.body.should.have.length(productsSorted.length);
                    res.body.should.satisfy((val) => {
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].name !== productsSorted[i].name) {
                                return false;
                            }
                        }
                        return true;
                    });
                    done();
                });
            });
            it('should throw an error if specified seller ID does not exist', (done) => {
                chai.request(server).get('/products/byseller/58f60aef2878a22f6824f099').end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('should throw an error if specified seller ID is not valid', (done) => {
                chai.request(server).get('/products/byseller/58f60aef2878a22f6824f09g').end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('products by category', () => {
            it('should be possible to list all products that belong to specified category', (done) => {
                chai.request(server).get('/products/bysubcategory/' + config.categories[1]._id).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsLen = config.products.filter((elem) => {
                        return elem.subcategory_id.toString() == config.categories[1]._id.toString();
                    }).length;
                    res.body.should.have.length(productsLen);
                    done();
                });
            });
            it('should be possible to list all products that belong to specified category in descending order by name', (done) => {
                chai.request(server).get('/products/bysubcategory/' + config.categories[1]._id + '/name/desc').end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsSorted = config.products.filter((elem) => {
                        return elem.subcategory_id.toString() == config.categories[1]._id.toString();
                    }).sort((a, b) => {
                        return a.name < b.name ? 1 : -1;
                    });
                    res.body.should.have.length(productsSorted.length);
                    res.body.should.satisfy((val) => {
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].name !== productsSorted[i].name) {
                                return false;
                            }
                        }
                        return true;
                    });
                    done();
                });
            });
            it('should throw an error if specified category ID does not exist', (done) => {
                chai.request(server).get('/products/bysubcategory/58fdb56d93c22717c88234bf').end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('should throw an error if specified category ID is not valid', (done) => {
                chai.request(server).get('/products/bysubcategory/58fdb56d93c22716c88234bg').end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('products by seller and category', () => {
            it('should be possible to list all products that belong to specified seller and category', (done) => {
                chai.request(server).get('/products/bysellerandsubcategory/' + config.customers.seller._id + '/' + config.categories[1]._id).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsLen = config.products.filter((elem) => {
                        return elem.subcategory_id.toString() == config.categories[1]._id.toString() && elem.seller_id.toString() == config.customers.seller._id.toString();
                    }).length;
                    res.body.should.have.length(productsLen);
                    done();
                });
            });
            it('should be possible to list all products that belong to specified seller and category in descending order by name', (done) => {
                chai.request(server).get('/products/bysellerandsubcategory/' + config.customers.seller._id + '/' + config.categories[1]._id + '/name/desc').end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsSorted = config.products.filter((elem) => {
                        return elem.subcategory_id.toString() == config.categories[1]._id.toString() && elem.seller_id.toString() == config.customers.seller._id.toString();
                    }).sort((a, b) => {
                        return a.name < b.name ? 1 : -1;
                    });
                    res.body.should.have.length(productsSorted.length);
                    res.body.should.satisfy((val) => {
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].name !== productsSorted[i].name) {
                                return false;
                            }
                        }
                        return true;
                    });
                    done();
                });
            });
            it('should throw an error if specified seller and category ID does not exist', (done) => {
                chai.request(server).get('/products/bysellerandsubcategory/58f60aef2878a22f6824f099/58fdb56d93c22717c88234bf').end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('should throw an error if specified seller and category ID is not valid', (done) => {
                chai.request(server).get('/products/bysellerandsubcategory/58f60aef2878a22f6824f09g/58fdb56d93c22716c88234bg').end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('product by ID', () => {
            it('should be possible to get general information about one product by ID', (done) => {
                var testProduct = config.products[0];
                chai.request(server).get('/products/' + testProduct._id).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body[0]._id.should.be.equal(testProduct._id.toString());
                    res.body[0].name.should.be.equal(testProduct.name);
                    res.body[0].should.not.have.property('price_bought');
                    done();
                });
            });
            it('should throw an error if specified product ID does not exist', (done) => {
                chai.request(server).get('/products/58ff577e8cceae2904475c6b').end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('should throw an error if specified product ID is not valid', (done) => {
                chai.request(server).get('/products/58ff577e8cceae2904475c6g').end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
    });

    describe('Managing product', () => {
        describe('creating new product', () => {
            it.skip('should be possible to create new product by authorized seller or administrator', (done) => {
                done();
            });
            it.skip('should not be possible to create new product by authorized buyer', (done) => {
                done();
            });
            it.skip('should not be possible to create new product by unauthorized user', (done) => {
                done();
            });
        });
        describe('getting detailed information about product', () => {
            it.skip('should be possible to get information about product by authorized seller or administrator', (done) => {
                done();
            });
            it.skip('should not be possible to get information about product by authorized buyer', (done) => {
                done();
            });
            it.skip('should not be possible to get information about product by unauthorized user', (done) => {
                done();
            });
            it.skip('should throw an error if specified product ID does not exist', (done) => {
                chai.request(server).get('/products/58ff577e8cceae2904475c6b').end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it.skip('should throw an error if specified product ID is not valid', (done) => {
                chai.request(server).get('/product/58ff577e8cceae2904475c6g').end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('updating information about product', () => {});
        describe('deleting information about product', () => {});
    });

    after('Cleanup tables', () => {
        return Customers.remove({}).then(() => {
            return Roles.remove({});
        }).then(() => {
            return CountriesCities.remove({});
        }).then(() => {
            return Categories.remove({});
        }).then(() => {
            return Products.remove({});
        });
    });
});