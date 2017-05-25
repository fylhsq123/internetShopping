'use strict';

var Customers = require('../api/models/customers'),
    CountriesCities = require('../api/models/countriesCities'),
    Roles = require('../api/models/roles'),
    Products = require('../api/models/products'),
    Categories = require('../api/models/categories'),

    chai = require('chai'),
    chaiHttp = require('chai-http'),
    chaiFiles = require('chai-files'),
    file = chaiFiles.file,
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),

    server = require('../server'),
    config = require('config'),
    io = require('socket.io-client'),
    events = require('../common/global-event-emitter');

chai.use(chaiHttp).use(chaiFiles).should();

describe('PRODUCTS', () => {
    var customersArr = [config.customers.admin, config.customers.seller, config.customers.buyer];

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
        describe('partial loading', () => {
            it('should be possible to load part of data', (done) => {
                var itemsNum = 3;
                chai.request(server).get('/products').query({
                    'limit': itemsNum
                }).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(itemsNum);
                    done();
                });
            });
            it('should be possible to load part of data after specified element', (done) => {
                var itemsNum = 3;
                chai.request(server).get('/products').query({
                    'lastid': config.products[2]._id.toString(),
                    'limit': itemsNum
                }).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    var expectedArray = config.products.filter((elem) => {
                        return elem._id > config.products[2]._id;
                    }).sort((a, b) => {
                        return parseInt(a._id, 16) - parseInt(b._id, 16);
                    });
                    res.body.should.have.length(expectedArray.length);
                    res.body.should.satisfy((val) => {
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].name !== expectedArray[i].name) {
                                return false;
                            }
                        }
                        return true;
                    });
                    done();
                });
            });
            it('should be possible to load part of data after specified element in sort order', (done) => {
                var itemsNum = 3,
                    testProduct = config.products[1];
                chai.request(server).get('/products').query({
                    'lastid': testProduct._id.toString(),
                    'lastval': testProduct.name,
                    'sort': 'name',
                    'order': 'desc',
                    'limit': itemsNum
                }).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    var expectedArray = config.products.filter((elem) => {
                        return elem.name < testProduct.name || (elem.name === testProduct.name && elem._id < testProduct._id);
                    }).sort((a, b) => {
                        return a.name < b.name;
                    });
                    res.body.should.have.length(expectedArray.length);
                    res.body.should.satisfy((val) => {
                        for (let i = 0; i < val.length; i++) {
                            if (val[i].name !== expectedArray[i].name) {
                                return false;
                            }
                        }
                        return true;
                    });
                    done();
                });
            });
        });
        describe('products by seller', () => {
            it('should be possible to list all products that belong to specified seller', (done) => {
                chai.request(server).get('/products').query({
                    'seller': config.customers.seller._id.toString()
                }).end((err, res) => {
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
                chai.request(server).get('/products').query({
                    'seller': config.customers.seller._id.toString(),
                    'sort': 'name',
                    'order': 'desc'
                }).end((err, res) => {
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
            it('should send an empty array if specified seller ID does not exist', (done) => {
                chai.request(server).get('/products').query({
                    'seller': '58f60aef2878a22f6824f099'
                }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.empty;
                    done();
                });
            });
            it('should throw an error if specified seller ID is not valid', (done) => {
                chai.request(server).get('/products').query({
                    'seller': '58f60aef2878a22f6824f09g'
                }).end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('products by category', () => {
            it('should be possible to list all products that belong to specified category', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': config.categories[1]._id.toString()
                }).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsLen = config.products.filter((elem) => {
                        return elem.subcategory_id.toString() == config.categories[1]._id.toString();
                    }).length;
                    res.body.should.have.length(productsLen);
                    done();
                });
            });
            it('should be possible to list all products that belong to specified category in ascending order by name', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': config.categories[1]._id.toString(),
                    'sort': 'name',
                    'order': 'asc'
                }).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    var productsSorted = config.products.filter((elem) => {
                        return elem.subcategory_id.toString() == config.categories[1]._id.toString();
                    }).sort((a, b) => {
                        return a.name < b.name ? -1 : 1;
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
            it('should send an empty array if specified category ID does not exist', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': '58fdb56d93c22717c88234bf'
                }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.empty;
                    done();
                });
            });
            it('should throw an error if specified category ID is not valid', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': '58fdb56d93c22716c88234bg'
                }).end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('products by seller and category', () => {
            it('should be possible to list all products that belong to specified seller and category', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': config.categories[1]._id.toString(),
                    'seller': config.customers.seller._id.toString()
                }).end((err, res) => {
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
                chai.request(server).get('/products').query({
                    'subcategory': config.categories[1]._id.toString(),
                    'seller': config.customers.seller._id.toString(),
                    'sort': 'name',
                    'order': 'desc'
                }).end((err, res) => {
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
            it('should send an empty array if specified seller and category ID does not exist', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': '58fdb56d93c22717c88234bf',
                    'seller': '58f60aef2878a22f6824f099'
                }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.empty;
                    done();
                });
            });
            it('should throw an error if specified seller and category ID is not valid', (done) => {
                chai.request(server).get('/products').query({
                    'subcategory': 'WrongSubcategoryID',
                    'seller': 'WrongSellerID'
                }).end((err, res) => {
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
            it('should send an empty array if specified product ID does not exist', (done) => {
                chai.request(server).get('/products/58ff577e8cceae2904475c6b').end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.empty;
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
        var authorizationBuyer, authorizationSeller,
            testValidProduct = {
                "name": "Test product3456563456",
                "description": "Test product description",
                "subcategory_id": "58fdb56d93c22716c88234bf",
                "price_sold": 123.45,
                "price_bought": 100.00,
                "count_sold": 15,
                "count_bought": 20,
            },
            testInvalidProduct = {
                "name": "",
                "description": ""
            };
        beforeEach('authenticate buyer', (done) => {
            chai.request(server).post('/authenticate').send({
                email: config.customers.buyer.email,
                password: config.customers.buyer.password_unhashed
            }).end((err, res) => {
                if (err) return done(err);
                authorizationBuyer = res.body.token;
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
        describe('creating new product', () => {
            beforeEach('create fake file', () => {
                return new Promise((resolve, reject) => {
                    fs.writeFile(config.upload_dir + config.testFile.name, config.testFile.content, (err) => {
                        if (err) return reject(err);
                        fs.writeFile(config.upload_dir + config.testImageFile.name, config.testImageFile.content, (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });
            });
            it('should be possible to create new product by authorized seller or administrator', (done) => {
                chai.request(server).post('/product').set("Authorization", authorizationSeller)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.should.have.status(201);
                        res.body.name.should.be.equal(testValidProduct.name);
                        res.body.image.should.not.be.empty;
                        file(config.upload_dir + res.body.image).should.exist;
                        done();
                    });
            });
            it.skip('should broadcast message when new product was created', (done) => {
                var client = io.connect('192.168.2.65:3007');
                client.on('news', (data) => {
                    console.log(data);
                    done();
                });
                events.emit(config.eventNameForNewProduct, {
                    '_id': config.products[0]._id,
                    'name': config.products[0].name,
                    'seller': config.products[0].seller,
                    'category': config.products[0].category
                });
            });
            it('should ignore other files except images', (done) => {
                chai.request(server).post('/product').set("Authorization", authorizationSeller)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testFile.name), config.testFile.name)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.should.have.status(201);
                        res.body.name.should.be.equal(testValidProduct.name);
                        res.body.image.should.be.empty;
                        done();
                    });
            });
            it('should not be possible to create new product by authorized seller or administrator if input data is invalid', (done) => {
                chai.request(server).post('/product/').set("Authorization", authorizationSeller)
                    .field("name", testInvalidProduct.name)
                    .field("description", testInvalidProduct.description)
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
            it('should not be possible to create new product by authorized buyer', (done) => {
                chai.request(server).post('/product').set("Authorization", authorizationBuyer)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        res.should.have.status(403);
                        done();
                    });
            });
            it('should not be possible to create new product by unauthorized user', (done) => {
                chai.request(server).post('/product')
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });
        describe('getting detailed information about product', () => {
            it('should be possible to get information about product by authorized seller or administrator', (done) => {
                chai.request(server).get('/product/' + config.products[0]._id).set("Authorization", authorizationSeller).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    res.body._id.should.be.equal(config.products[0]._id.toString());
                    res.body.name.should.be.equal(config.products[0].name);
                    done();
                });
            });
            it('should not be possible to get information about product by authorized buyer', (done) => {
                chai.request(server).get('/product/' + config.products[0]._id).set("Authorization", authorizationBuyer).end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
            });
            it('should not be possible to get information about product by unauthorized user', (done) => {
                chai.request(server).get('/product/' + config.products[0]._id).end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
            });
            it('should throw an error if specified product ID does not exist', (done) => {
                chai.request(server).get('/product/58ff577e8cceae2904475c6b').set("Authorization", authorizationSeller).end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('should throw an error if specified product ID is not valid', (done) => {
                chai.request(server).get('/product/58ff577e8cceae2904475c6g').set("Authorization", authorizationSeller).end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
        describe('updating information about product', () => {
            beforeEach('create fake file', () => {
                return new Promise((resolve, reject) => {
                    fs.writeFile(config.upload_dir + config.testFile.name, config.testFile.content, (err) => {
                        if (err) return reject(err);
                        fs.writeFile(config.upload_dir + config.testImageFile.name, config.testImageFile.content, (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    });
                });
            });
            it('should be possible to update product by authorized seller or administrator', (done) => {
                chai.request(server).put('/product/' + config.products[0]._id).set("Authorization", authorizationSeller)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        if (err) return done(err);
                        res.should.have.status(200);
                        res.body.response.msg.should.not.be.empty;
                        done();
                    });
            });
            it('should not be possible to update product by authorized seller or administrator if input data is invalid', (done) => {
                chai.request(server).put('/product/' + config.products[0]._id).set("Authorization", authorizationSeller)
                    .field("name", testInvalidProduct.name)
                    .field("description", testInvalidProduct.description)
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
            it('should not be possible to update product by authorized buyer', (done) => {
                chai.request(server).put('/product/' + config.products[0]._id).set("Authorization", authorizationBuyer)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        res.should.have.status(403);
                        done();
                    });
            });
            it('should not be possible to update product by unauthorized user', (done) => {
                chai.request(server).put('/product/' + config.products[0]._id)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
            it('should throw an error if product was not found', (done) => {
                chai.request(server).put('/product/59009df29cf77d3a40479fdb').set("Authorization", authorizationSeller)
                    .field("name", testValidProduct.name)
                    .field("description", testValidProduct.description)
                    .field("count_bought", testValidProduct.count_bought)
                    .field("count_sold", testValidProduct.count_sold)
                    .field("price_bought", testValidProduct.price_bought)
                    .field("price_sold", testValidProduct.price_sold)
                    .field("subcategory_id", testValidProduct.subcategory_id)
                    .attach('image', fs.readFileSync(config.upload_dir + config.testImageFile.name), config.testImageFile.name)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        describe('deleting information about product', () => {
            it('should be possible to delete information about product by authorized seller or administrator', (done) => {
                chai.request(server).del('/product/' + config.products[0]._id).set("Authorization", authorizationSeller).end((err, res) => {
                    if (err) return done(err);
                    res.should.have.status(200);
                    done();
                });
            });
            it('should not be possible to delete information about product by authorized buyer', (done) => {
                chai.request(server).del('/product/' + config.products[0]._id).set("Authorization", authorizationBuyer).end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
            });
            it('should not be possible to delete information about product by unauthorized user', (done) => {
                chai.request(server).del('/product/' + config.products[0]._id).end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
            });
            it('should throw an error if specified product ID does not exist', (done) => {
                chai.request(server).del('/product/58ff577e8cceae2904475c6b').set("Authorization", authorizationSeller).end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
            });
            it('should throw an error if specified product ID is not valid', (done) => {
                chai.request(server).del('/product/58ff577e8cceae2904475c6g').set("Authorization", authorizationSeller).end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
        });
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
    after('Delete temporary files', (done) => {
        fs.readdir(config.upload_dir, (err, files) => {
            if (err) throw err;
            var promises = [];

            for (let file of files) {
                let promise = new Promise((resolve, reject) => {
                    fs.unlink(path.join(config.upload_dir, file), err => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
                promises.push(promise);
            }
            Promise.all(promises).then(() => {
                done();
            }).catch((err) => {
                done(err);
            })
        });
    });
});