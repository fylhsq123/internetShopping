'use strict';
var CountriesCities = require('../models/countriesCities.js'),
	module = require('./countriesCities');
describe("COUNTRIESCITIES unit tests", function () {
	beforeEach(function () {
		this.sandbox.stub(CountriesCities, "find");
		this.sandbox.stub(CountriesCities, "findById");
		this.req = {
			params: {
				countryId: "countryID"
			}
		};
		this.res = {
			json: () => {}
		};
		this.nextSpy = this.sandbox.spy();
		this.jsonSpy = this.sandbox.spy(this.res, "json");
	});
	afterEach(function () {
		CountriesCities.find.restore();
		CountriesCities.findById.restore();
		delete this.req;
		delete this.res;
		delete this.nextSpy;
		delete this.jsonSpy;
	});
	describe("Listing countries", function () {
		it("should call 'res.json' if no errors with object pathed into callback", function () {
			CountriesCities.find.yields(null, this.testObj);
			module.list_all_countries(this.req, this.res, this.nextSpy);

			this.nextSpy.should.have.not.been.called;
			this.jsonSpy.should.have.been.calledOnce;
			this.jsonSpy.args[0][0].should.be.equal(this.testObj);
		});
		it("should call 'next' if error occures", function () {
			CountriesCities.find.yields(this.errObj);
			module.list_all_countries(this.req, this.res, this.nextSpy);

			this.jsonSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].should.have.property('err');
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
	});
	describe("Listing cities", function () {
		it("should call 'res.json' if no errors with object pathed into callback", function () {
			CountriesCities.findById.yields(null, this.testObj);
			module.list_all_cities(this.req, this.res, this.nextSpy);

			CountriesCities.findById.should.have.been.calledWith(this.req.params.countryId);
			this.nextSpy.should.have.not.been.called;
			this.jsonSpy.should.have.been.calledOnce;
			this.jsonSpy.args[0][0].should.be.equal(this.testObj);
		});
		it("should call 'next' if error occures", function () {
			CountriesCities.findById.yields(this.errObj);
			module.list_all_cities(this.req, this.res, this.nextSpy);

			CountriesCities.findById.should.have.been.calledWith(this.req.params.countryId);
			this.jsonSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].should.have.property('err');
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
	});
});