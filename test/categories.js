'use strict';

var Categories = require('../api/models/categories'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),

    server = require('../server'),
    config = require('config');

chai.use(chaiHttp).should();

describe('CATEGORIES', () => {
    before('Load categories table', () => {
        return Categories.remove({}).then(() => {
            return Categories.insertMany(config.categories);
        });
    });
    describe('Listing categories hierarchy', () => {
        it('should be possible to load categories', (done) => {
            chai.request(server).get('/categories').end((err, res) => {
                if (err) return done(err);
                var categories = config.categories.filter((elem) => {
                    return elem.parent_id.toString() === '000000000000000000000000';
                });
                res.should.have.status(200);
                res.body.should.have.length(categories.length);
                done();
            });
        });
    });
    describe('Listing subcategories', () => {
        it('should be possible to load subcategory of specified category', (done) => {
            var category = config.categories.filter((elem) => {
                return elem.parent_id.toString() === '000000000000000000000000';
            })[0];
            chai.request(server).get('/subcategories/' + category._id).end((err, res) => {
                if (err) return done(err);
                res.should.have.status(200);
                res.body.should.be.an('array');
                var subcategories = config.categories.filter((elem) => {
                    return elem.parent_id.toString() === category._id.toString();
                });
                res.body.should.have.length(subcategories.length);
                done();
            });
        });
        it('should throw error if specified ID does not exist', (done)=>{
            chai.request(server).get('/subcategories/58fdb56d93c22716c88234b3').end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        it('should throw error if specified ID is not valid', (done)=>{
            chai.request(server).get('/subcategories/SomeWrongID').end((err, res) => {
                res.should.have.status(500);
                done();
            });
        });
    });
    after('Cleanup table', () => {
        return Categories.remove({});
    });
});