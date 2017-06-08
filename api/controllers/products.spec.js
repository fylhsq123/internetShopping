"use strict";
var Products = require('../models/products'),
    // Promise = require('bluebird'),
    fs = require('fs'),
    formidable = require('formidable'),
    module = require('./products');
describe("PRODUCTS unit tests", function () {
    beforeEach(function () {
        var _this = this;

        function fakeCall() {
            return Products;
        }
        this.product = Object.assign({}, this.testObj, {
            _id: 'ProductID',
            toObject: this.sandbox.stub().callsFake(() => {
                console.log(this._id);
                return this.product;
            }),
            save: this.sandbox.stub()
        });
        // this.bluebirdThenStub = this.sandbox.stub(Promise.prototype, 'then').callsFake(function () {
        //     return this;
        // });
        // this.bluebirdCatchStub = this.sandbox.stub(Promise.prototype, 'catch');
        this.renameSyncStub = this.sandbox.stub(fs, 'renameSync');
        this.formParseStub = this.sandbox.stub(formidable.IncomingForm.prototype, 'parse');
        this.modelSaveStub = this.sandbox.stub(Products.prototype, 'save').callsFake(() => {
            return this.product;
        });
        Object.assign(Products, {
            select: function () {},
            sort: function () {},
            limit: function () {},
            exec: function () {},
            then: function () {},
            catch: function () {}
        });
        this.ProductsMock = this.sandbox.mock(Products);
        this.sandbox.stub(Products, "find").callsFake(fakeCall);
        this.sandbox.stub(Products, "findById").callsFake(fakeCall);
        this.sandbox.stub(Products, "findOneAndUpdate").callsFake(fakeCall);
        this.sandbox.stub(Products, "select").callsFake(fakeCall);
        this.sandbox.stub(Products, "sort").callsFake(fakeCall);
        this.sandbox.stub(Products, "limit").callsFake(fakeCall);
        this.sandbox.stub(Products, "where").callsFake(fakeCall);
        this.sandbox.stub(Products, "populate").callsFake(fakeCall);
        this.sandbox.stub(Products, "exec").callsFake(fakeCall);
        this.thenStub = this.sandbox.stub(Products, "then").callsFake(fakeCall);
        this.catchStub = this.sandbox.stub(Products, "catch").callsFake(fakeCall);
        this.req = {
            user: {
                _id: 'UserID',
                role_id: {
                    type: ''
                }
            },
            params: {
                productId: ''
            },
            query: {},
            cookies: {
                io: 'SocketClientID'
            }
        };
        this.res = {
            send: () => {},
            status: function () {
                return this;
            }
        };
        this.nextSpy = this.sandbox.spy();
        this.statusSpy = this.sandbox.spy(this.res, 'status');
        this.sendSpy = this.sandbox.spy(this.res, "send");
    });
    afterEach(function () {
        this.renameSyncStub.restore();
        this.formParseStub.restore();
        this.modelSaveStub.restore();
        this.ProductsMock.restore();
        Products.find.restore();
        Products.findById.restore();
        Products.findOneAndUpdate.restore();
        Products.select.restore();
        Products.sort.restore();
        Products.limit.restore();
        Products.where.restore();
        Products.populate.restore();
        Products.exec.restore();
        this.thenStub.restore();
        this.catchStub.restore();
        delete this.req;
        delete this.res;
        delete this.nextSpy;
        delete this.statusSpy;
        delete this.sendSpy;
    });
    describe('Listing products', function () {
        it('should be possible to list all products', function () {
            Products.exec.yields(null, this.testObj);
            module.list_all_products(this.req, this.res, this.nextSpy);

            this.sendSpy.should.have.been.calledOnce.and.calledWithExactly(this.testObj);
            Products.find.args[0][0].should.have.property('$and');
            Products.find.args[0][0].$and.should.be.an('array');
            Products.find.args[0][0].$and[0].should.have.property('dwh_deleted');
            Products.find.args[0][0].$and[0].dwh_deleted.should.be.equal(false);
        });
        it('should handle different types of errors', function () {
            Products.exec.yields(this.errObj);
            module.list_all_products(this.req, this.res, this.nextSpy);

            this.sendSpy.should.have.not.been.called;
            this.nextSpy.should.have.been.calledOnce;
            this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
        });
        it('should be possible to get one product by ID', function () {
            this.req.params.productId = 'ProductID';
            module.list_all_products(this.req, this.res, this.nextSpy);

            Products.find.args[0][0].should.have.property('_id');
            Products.find.args[0][0]._id.should.be.equal(this.req.params.productId);
            Products.find.args[0][0].should.have.property('$and');
            Products.find.args[0][0].$and.should.be.an('array');
            Products.find.args[0][0].$and[0].should.have.property('dwh_deleted');
            Products.find.args[0][0].$and[0].dwh_deleted.should.be.equal(false);
        });
        it('should be possible to filter list of products by seller and subcategory and order ', function () {
            this.req.query.seller = 'SellerID';
            this.req.query.subcategory = 'SubcategoryID';
            this.req.query.sort = 'field';
            this.req.query.order = 'asc';
            module.list_all_products(this.req, this.res, this.nextSpy);

            Products.find.args[0][0].should.have.property('$and');
            Products.find.args[0][0].$and.should.be.an('array');
            Products.find.args[0][0].$and.should.include({
                dwh_deleted: false
            }).and.include({
                subcategory_id: this.req.query.subcategory
            }).and.include({
                seller_id: this.req.query.seller
            });
            Products.sort.args[0][0].should.have.property(this.req.query.sort);
            Products.sort.args[0][0][this.req.query.sort].should.be.equal(this.req.query.order === 'desc' ? -1 : 1);
        });
        it('should create correct query for loading part of the data starting from specified _id', function () {
            this.req.query.lastid = 'LastElementID';
            module.list_all_products(this.req, this.res, this.nextSpy);

            Products.find.args[0][0].should.have.property('$and');
            Products.find.args[0][0].$and.should.be.an('array');
            Products.find.args[0][0].$and.should.include({
                dwh_deleted: false
            }).and.include({
                _id: {
                    '$gt': this.req.query.lastid
                }
            });
        });
        it('should create correct query for loading part of the data starting from specified element in correct sort order', function () {
            this.req.query.lastid = 'LastElementID';
            this.req.query.lastval = 'ValueFromSortField';
            this.req.query.sort = 'field';
            this.req.query.order = 'asc';
            module.list_all_products(this.req, this.res, this.nextSpy);

            Products.find.args[0][0].should.have.property('$and');
            Products.find.args[0][0].$and.should.be.an('array');
            Products.find.args[0][0].$and.should.include({
                dwh_deleted: false
            }).and.include({
                $or: [{
                    [this.req.query.sort]: {
                        '$gt': this.req.query.lastval
                    }
                }, {
                    $and: [{
                        [this.req.query.sort]: this.req.query.lastval
                    }, {
                        _id: {
                            $gt: this.req.query.lastid
                        }
                    }]
                }]
            });
        });
    });
    describe('Creating new product', function () {
        it('should be possible to create new product', function () {
            var files = {
                    'image': {
                        type: 'image/jpeg',
                        name: 'fileName.ext',
                        path: 'temporaryFilePath'
                    }
                },
                fields = {
                    'field': 'value'
                };
            Products.exec.callsFake(() => {
                return this.product;
            });
            this.req.user.role_id.type = 'seller';
            this.formParseStub.yields(null, fields, files);
            // this.bluebirdThenStub.yields(this.testObj);
            module.create_new_product(this.req, this.res, this.nextSpy);
        });
        it('should send error 403 if someone except seller or admin is trying to create new product', function () {
            module.create_new_product(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
    });
    describe('Reading product info', function () {
        it('should be possible to read detailed product info for seller or admin', function () {
            this.req.user.role_id.type = 'seller';
            this.thenStub.yields(this.testObj);
            module.read_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.sendSpy.should.have.been.calledOnce.and.calledWithExactly(this.testObj);
        });
        it('should send error 403 if someone except seller or admin is trying to read detailed product info', function () {
            module.read_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
        it('should throw error 404 if product was not found', function () {
            this.req.user.role_id.type = 'seller';
            this.thenStub.yields();
            try {
                module.read_product_info(this.req, this.res, this.nextSpy);
            } catch (error) {
                error.should.have.property('statusCode');
                error.statusCode.should.be.equal(404);
                error.should.have.property('response');
                error.response.msg.should.not.be.empty;
            }
            this.nextSpy.should.have.not.been.called;
            this.thenStub.should.have.thrown();
        });
        it('should catch different types of errors', function () {
            this.req.user.role_id.type = 'seller';
            this.errObj.statusCode = 400;
            this.catchStub.yields(this.errObj);
            module.read_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(this.errObj.statusCode);
            this.sendSpy.should.have.been.calledOnce;

            this.statusSpy.reset();
            this.sendSpy.reset();
            delete this.errObj.statusCode;

            module.read_product_info(this.req, this.res, this.nextSpy);
            this.statusSpy.should.have.not.been.called;
            this.sendSpy.should.have.not.been.called;
            this.nextSpy.should.have.been.calledOnce;
            this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
        });
    });
    describe('Updating product info', function () {
        it.skip('should be possible to update product info', function () {});
        it('should send error 403 if someone except seller or admin is trying to update information about product', function () {
            module.update_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
    });
    describe('Deleting product', function () {
        it('should be possible to delete product', function () {
            this.req.user.role_id.type = 'seller';
            this.thenStub.yields(this.testObj);
            module.delete_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(200);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
        it('should send error 403 if someone except seller or admin is trying to delete product', function () {
            module.delete_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
        it('should send error 404 if product was not found', function () {
            this.req.user.role_id.type = 'seller';
            this.thenStub.yields(null);
            module.delete_product_info(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(404);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
        it('should catch other errors', function () {
            this.req.user.role_id.type = 'seller';
            this.catchStub.yields(this.errObj);
            module.delete_product_info(this.req, this.res, this.nextSpy);

            this.statusSpy.should.have.not.been.called;
            this.sendSpy.should.have.not.been.called;
            this.nextSpy.should.have.been.calledOnce;
            this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
        });
    });
});