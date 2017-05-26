const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
before(function () {
	chai.use(sinonChai).should();
	this.errObj = {
		text: "Error occured"
	};
	this.testObj = {
		testKey: "testValue"
	};
});
beforeEach(function () {
	this.sandbox = sinon.sandbox.create();
});
afterEach(function () {
	this.sandbox.restore();
});