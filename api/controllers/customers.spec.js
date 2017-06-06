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
			catch: function () {},
			save: function () {}
		});
		this.CustomersMock = this.sandbox.mock(Customers);
		this.sandbox.stub(Customers, "find").callsFake(fakeCall);
		this.sandbox.stub(Customers, "findById").callsFake(fakeCall);
		this.sandbox.stub(Customers, "findOne").callsFake(fakeCall);
		this.sandbox.stub(Customers, "findOneAndUpdate").callsFake(fakeCall);
		this.sandbox.stub(Customers, "select").callsFake(fakeCall);
		this.sandbox.stub(Customers, "where").callsFake(fakeCall);
		this.sandbox.stub(Customers, "populate").callsFake(fakeCall);
		this.sandbox.stub(Customers, "exec").callsFake(fakeCall);
		this.sandbox.stub(Customers, "then").callsFake(fakeCall);
		this.sandbox.stub(Customers, "catch").callsFake(fakeCall);
		this.saveStub = this.sandbox.stub(Customers.prototype, "save");
		this.customer = Object.assign({}, this.testObj, {
			comparePassword: this.sandbox.stub(),
			toObject: this.sandbox.stub().callsFake(() => {
				return {};
			}),
			save: this.sandbox.stub()
		});
		this.req = {
			params: {
				customerId: ""
			},
			user: {
				_id: 'CurrentUserID',
				role_id: {
					type: ''
				}
			},
			body: {
				email: 'someEmail',
				password: 'somePassword'
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
		Customers.findOne.restore();
		Customers.findOneAndUpdate.restore();
		Customers.select.restore();
		Customers.where.restore();
		Customers.populate.restore();
		Customers.exec.restore();
		Customers.then.restore();
		Customers.catch.restore();
		this.saveStub.restore();
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
	describe('Creating new customer', function () {
		it('should be possible to register new customer', function () {
			this.saveStub.yields(null, this.customer);
			module.create_customer(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.saveStub.should.have.been.calledOnce;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(201);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should handle ValidationError', function () {
			this.saveStub.yields({
				name: 'ValidationError'
			}, null);
			module.create_customer(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.saveStub.should.have.been.calledOnce;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(400);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should handle duplicates', function () {
			this.saveStub.yields({
				code: 11000
			}, null);
			module.create_customer(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.saveStub.should.have.been.calledOnce;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(409);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should handle other errors', function () {
			this.saveStub.yields(this.errObj, null);
			module.create_customer(this.req, this.res, this.nextSpy);

			this.saveStub.should.have.been.calledOnce;
			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
	});
	describe('Updating information about customer', function () {
		it('should be possible to update info about customer by himself', function () {
			Customers.then.yields(this.testObj);
			module.update_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(200);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should send 404 if customer was not found', function () {
			Customers.then.yields();
			module.update_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(404);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should handle error that were got from Mongoose', function () {
			Customers.catch.yields(this.errObj);
			module.update_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
		it('should be possible to update information of any customer by admin', function () {
			this.req.user.role_id.type = 'admin';
			this.req.params.customerId = 'SomeOtherCustomerID';
			Customers.then.yields(this.testObj);
			module.update_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.params.customerId,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(200);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should not be possible to update information of any customer by other customers except admin', function () {
			this.req.params.customerId = 'SomeOtherCustomerID';
			Customers.then.yields(this.testObj);
			module.update_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.not.been.called;
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
			this.sendSpy.should.have.been.calledOnce;
		});
	});
	describe('Deleting customer', function () {
		it('should be possible to delete information about customer by himself', function () {
			Customers.then.yields(this.testObj);
			module.delete_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(200);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should send 404 if customer was not found', function () {
			Customers.then.yields();
			module.delete_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(404);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should handle error that were got from Mongoose', function () {
			Customers.catch.yields(this.errObj);
			module.delete_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
		it('should be possible to delete information of any customer by admin', function () {
			this.req.user.role_id.type = 'admin';
			this.req.params.customerId = 'SomeOtherCustomerID';
			Customers.then.yields(this.testObj);
			module.delete_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.params.customerId,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(200);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should not be possible to delete information of any customer by other customers except admin', function () {
			this.req.params.customerId = 'SomeOtherCustomerID';
			Customers.then.yields(this.testObj);
			module.delete_customer(this.req, this.res, this.nextSpy);

			Customers.findOneAndUpdate.should.have.not.been.called;
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
			this.sendSpy.should.have.been.calledOnce;
		});
	});
	describe('Customer authentication', function () {
		it('should be possible to login', function () {
			this.customer.comparePassword.yields(null, true);
			Customers.then.yields(this.customer);
			module.authenticate_customer(this.req, this.res, this.nextSpy);

			Customers.findOne.should.have.been.calledOnce.and.calledWith({
				'email': this.req.body.email,
				'dwh_deleted': false
			});
			this.statusSpy.should.have.not.been.called;
			this.nextSpy.should.have.not.been.called;
			this.sendSpy.should.have.been.calledOnce;
			this.sendSpy.args[0][0].should.have.property('token');
			this.sendSpy.args[0][0].token.should.not.be.empty;
		});
		it('should handle error that were got from Mongoose', function () {
			Customers.catch.yields(this.errObj);
			module.authenticate_customer(this.req, this.res, this.nextSpy);

			Customers.findOne.should.have.been.calledOnce.and.calledWith({
				'email': this.req.body.email,
				'dwh_deleted': false
			});
			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
		it('should send 403 (authentication failed) if email was not found', function () {
			Customers.then.yields();
			module.authenticate_customer(this.req, this.res, this.nextSpy);

			Customers.findOne.should.have.been.calledOnce.and.calledWith({
				'email': this.req.body.email,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should send 403 (authentication failed) if password is wrong', function () {
			this.customer.comparePassword.yields(null, false);
			Customers.then.yields(this.customer);
			module.authenticate_customer(this.req, this.res, this.nextSpy);

			Customers.findOne.should.have.been.calledOnce.and.calledWith({
				'email': this.req.body.email,
				'dwh_deleted': false
			});
			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
			this.sendSpy.should.have.been.calledOnce;
		});
	});
	describe('Changing password', function () {
		it('should be possible to change password', function () {
			Customers.then.yields(this.customer);
			module.change_password(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.customer.save.should.have.been.calledOnce;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(200);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should handle error that were got from Mongoose', function () {
			Customers.catch.yields(this.errObj);
			module.change_password(this.req, this.res, this.nextSpy);

			Customers.findOne.should.have.been.calledOnce.and.calledWith({
				'_id': this.req.user._id,
				'dwh_deleted': false
			});
			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
		it('should send error 400 if password was not specified', function () {
			this.req.body.password = '';
			module.change_password(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(400);
			this.sendSpy.should.have.been.calledOnce;
		});
	});
	describe('Customer logout', function () {
		it('should logout customer', function () {
			Customers.exec.yields(null, this.customer);
			module.logout_customer(this.req, this.res, this.nextSpy);

			this.statusSpy.should.have.not.been.called;
			this.nextSpy.should.have.not.been.called;
			this.sendSpy.should.have.been.calledOnce;
			this.sendSpy.args[0][0].should.have.property('token');
			this.sendSpy.args[0][0].token.should.not.be.empty;
		});
		it('should handle error that were got from Mongoose', function () {
			Customers.exec.yields(this.errObj, null);
			module.logout_customer(this.req, this.res, this.nextSpy);

			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
		it('should send 403 (Logout failed) if customer was not found', function () {
			Customers.exec.yields(null, null);
			module.logout_customer(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.statusSpy.should.have.been.calledOnce.and.calledWithExactly(403);
			this.sendSpy.should.have.been.calledOnce;
		});
	});
});