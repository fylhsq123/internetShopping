'use strict';
var Customers = require('../models/customers.js'),
    module = require('./customers');
describe("CUSTOMERS unit tests", function () {
    beforeEach(function () {
        function fakeCall() {
            return Customers;
        }
        Object.assign(Customers, {
            select: function () {},
            exec: function () {},
            then: function () {},
            catch: function () {}
        });
        this.CustomersMock = this.sandbox.mock(Customers);
        this.sandbox.stub(Customers, "find").callsFake(fakeCall);
        this.sandbox.stub(Customers, "findById").callsFake(fakeCall);
        this.sandbox.stub(Customers, 'select').callsFake(fakeCall);
        this.sandbox.stub(Customers, 'where').callsFake(fakeCall);
        this.sandbox.stub(Customers, 'populate').callsFake(fakeCall);
        this.sandbox.stub(Customers, 'exec').callsFake(fakeCall);
        this.sandbox.stub(Customers, 'then').callsFake(fakeCall);
        this.sandbox.stub(Customers, 'catch').callsFake(fakeCall);
        this.req = {
            params: {
                customerId: ""
            },
            user: {
                _id: 'CurrentUserID',
                role_id: {
                    type: ''
                }
            }
        };
        this.res = {
            json: () => {},
            send: () => {},
            status: function () {
                return this;
            }
        };
        this.nextSpy = this.sandbox.spy();
        this.statusSpy = this.sandbox.spy(this.res, 'status');
        this.jsonSpy = this.sandbox.spy(this.res, "json");
        this.sendSpy = this.sandbox.spy(this.res, "send");
    });
    afterEach(function () {
        Customers.find.restore();
        Customers.findById.restore();
        Customers.select.restore();
        Customers.where.restore();
        Customers.populate.restore();
        Customers.exec.restore();
        Customers.then.restore();
        Customers.catch.restore();
        this.CustomersMock.restore();
        delete this.req;
        delete this.res;
        delete this.nextSpy;
        delete this.statusSpy;
        delete this.jsonSpy;
        delete this.sendSpy;
    });
    describe('Listing all customers', function () {
        it("should call 'res.json' if no exceptions and user type is 'admin'", function () {
            this.req.user.role_id.type = 'admin';

            Customers.then.yields(this.testObj);
            module.list_all_customers(this.req, this.res, this.nextSpy);

            Customers.then.should.have.been.calledOnce;
            this.nextSpy.should.have.not.been.called;
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].should.be.equal(this.testObj);
        });
        it("should call 'next' if exception occures and user type is 'admin'", function () {
            this.req.user.role_id.type = 'admin';

            Customers.catch.yields(this.errObj);
            module.list_all_customers(this.req, this.res, this.nextSpy);

            Customers.catch.should.have.been.calledOnce;
            this.sendSpy.should.have.not.been.called;
            this.nextSpy.should.have.been.calledOnce;
            this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
        });
        it("should send 403 error if user type is not 'admin'", function () {
            this.req.user.role_id.type = '';

            module.list_all_customers(this.req, this.res, this.nextSpy);

            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
    });
    describe('Getting information about customer', function () {
        it('should get information about currect logged in customer if no additional parameters where specified', function () {
            Customers.then.yields(this.testObj);
            module.read_customer_info(this.req, this.res, this.nextSpy);

            Customers.findById.should.have.been.calledOnce.and.calledWithExactly(this.req.user._id);
            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.not.been.called;
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].should.be.equal(this.testObj);
        });
        it('should send 404 if customer was not found', function () {
            Customers.then.yields(null);
            module.read_customer_info(this.req, this.res, this.nextSpy);

            Customers.findById.should.have.been.calledOnce.and.calledWithExactly(this.req.user._id);
            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(404);
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].response.msg.should.not.be.empty;
        });
        it("should call 'next' if exception occures", function () {
            Customers.catch.yields(this.errObj);
            module.read_customer_info(this.req, this.res, this.nextSpy);

            this.sendSpy.should.have.not.been.called;
            this.statusSpy.should.have.not.been.called;
            this.nextSpy.should.have.been.calledOnce;
            this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
        });
        it('should be possible to get information about other customers by admin', function () {
            this.req.user.role_id.type = 'admin';
            this.req.params.customerId = 'SomeOtherCustomerID';
            Customers.then.yields(this.testObj);
            module.read_customer_info(this.req, this.res, this.nextSpy);

            Customers.findById.should.have.been.calledOnce.and.calledWithExactly(this.req.params.customerId);
            this.nextSpy.should.have.not.been.called;
            this.statusSpy.should.have.not.been.called;
            this.sendSpy.should.have.been.calledOnce;
            this.sendSpy.args[0][0].should.be.equal(this.testObj);
        });
    });
});