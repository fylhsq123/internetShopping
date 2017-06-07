"use strict";
var Products = require('../models/products'),
    module = require('./products');
describe("PRODUCTS unit tests", function () {
    beforeEach(function () {
        function fakeCall() {
            return Products;
        }
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
                productId: 'ProductID'
            },
            query: {}
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
            module.list_all_products(this.req, this.res, this.nextSpy);
        });
    });
    describe('Creating new product', function () {
        it.skip('should be possible to create new product', function () {
            this.req.user.role_id.type = 'seller';
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