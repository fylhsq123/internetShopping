'use strict';

var module = require('./common.js');

describe('COMMON unit tests', function () {
	describe('File loading tests', function () {
		beforeEach(function () {
			this.req = {
				params: {
					sourceId: "FileName.ext"
				}
			};
			this.res = {
				sendFile: () => {},
				status: function () {
					return this;
				},
				send: () => {}
			};
			this.nextSpy = this.sandbox.spy();
			this.sendfileStub = this.sandbox.stub(this.res, 'sendFile');
			this.statusSpy = this.sandbox.spy(this.res, 'status');
			this.sendSpy = this.sandbox.spy(this.res, 'send');
		});
		it('should call sendFile function without calling next or send', function () {
			this.sendfileStub.yields();
			module.load_source(this.req, this.res, this.nextSpy);

			this.sendfileStub.should.have.been.calledOnce;
			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.not.been.called;
		});
		it('should send error 404 if err.status is equal 404', function () {
			this.sendfileStub.yields({
				status: 404
			});
			module.load_source(this.req, this.res, this.nextSpy);

			this.sendfileStub.should.have.been.calledOnce;
			this.statusSpy.should.have.been.calledWithMatch(404);
			this.sendSpy.should.have.been.calledOnce;
		});
		it('should call next function with error object', function () {
			this.sendfileStub.yields(this.errObj);
			module.load_source(this.req, this.res, this.nextSpy);

			this.statusSpy.should.have.not.been.called;
			this.sendSpy.should.have.not.been.called;
			this.nextSpy.should.have.been.calledOnce;
			this.nextSpy.args[0][0].should.have.property('err');
			this.nextSpy.args[0][0].err.should.be.equal(this.errObj);
		});
		afterEach(function () {
			this.sendfileStub.restore();
		});
	});
});