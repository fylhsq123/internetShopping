'use strict';
process.env.NODE_ENV = 'test';

var chai = require('chai'),
    chaiHttp = require('chai-http'),
    fs = require('fs'),

    server = require('../server'),
    config = require('config');

chai.use(chaiHttp).should();
describe('Common functionality', () => {
    describe('Wrong path handling', () => {
        it('should handle wrong path', (done) => {
            chai.request(server).get('/some/wrong/path').end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
    describe('File loading', () => {
        beforeEach('create fake file', () => {
            return new Promise((resolve, reject) => {
                fs.writeFile(config.upload_dir + config.testFile.name, config.testFile.content, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
        it('should be possible to load file', (done) => {
            chai.request(server).get('/sources/' + config.testFile.name).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.should.be.text;
                parseInt(res.header['content-length']).should.be.equal(5);
                done();
            });
        });
        it('should throw error 404 if file does not exist', (done) => {
            chai.request(server).get('/sources/wrongFileName').end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
});