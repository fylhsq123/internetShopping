'use strict';

var sinon = require('sinon'),
    common = require('./common.js');

describe('COMMON unit tests', () => {
    describe('File loading tests', () => {
        it('should call sendFile function without calling next or send', () => {
            var req = {
                    params: {
                        sourceId: "FileName.ext"
                    }
                },
                res = {
                    sendFile: () => {},
                    status: () => {},
                    send: () => {}
                },
                nextSpy = sinon.spy(),
                sendfileStub = sinon.stub(res, 'sendFile'),
                statusSpy = sinon.spy(res, 'status'),
                sendSpy = sinon.spy(res, 'send');

            sendfileStub.yields();
            common.load_source(req, res, nextSpy);
            sendfileStub.restore();

            sinon.assert.calledOnce(sendfileStub);
            sinon.assert.notCalled(statusSpy);
            sinon.assert.notCalled(sendSpy);
            sinon.assert.notCalled(nextSpy);
        });
        it('should throw error 404 if err.status is equal 404', () => {
            var req = {
                    params: {
                        sourceId: "FileName.ext"
                    }
                },
                res = {
                    sendFile: () => {},
                    status: function () {
                        return this;
                    },
                    send: () => {}
                },
                nextSpy = sinon.spy(),
                sendfileStub = sinon.stub(res, 'sendFile'),
                statusSpy = sinon.spy(res, 'status'),
                sendSpy = sinon.spy(res, 'send');

            sendfileStub.yields({
                status: 404
            });
            common.load_source(req, res, nextSpy);
            sendfileStub.restore();

            sinon.assert.calledOnce(sendfileStub);
            sinon.assert.calledOnce(sendSpy);
            sinon.assert.calledWithMatch(statusSpy, 404);
        });
        it('should call next function with error object', () => {
            var req = {
                    params: {
                        sourceId: "FileName.ext"
                    }
                },
                res = {
                    sendFile: () => {},
                    status: () => {},
                    send: () => {}
                },
                nextSpy = sinon.spy(),
                sendfileStub = sinon.stub(res, 'sendFile');

            sendfileStub.yields({});
            common.load_source(req, res, nextSpy);
            sendfileStub.restore();

            sinon.assert.calledOnce(nextSpy);
        });
    });
});