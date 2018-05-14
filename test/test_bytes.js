'use strict';
let app = require('../app');
let request = require('supertest');
let chai = require('chai');
let expect = chai.expect;

// integration tests, until I can find a satisfactory way to do unit tests

describe('files', function() {
    it('should accept connections to the /bytes router', function (done) {
        request(app)
            .get('/bytes')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, resp) {
                chai.expect(resp.id).to.be.undefined;
                chai.expect(resp.statusCode).to.equal(200);
                //console.log(resp.body);
                chai.expect(resp.header['content-type']).to.include('application/json');
                //res.body.should.have.property('').and.to.be.a('number').and.to.match(/regex/);
                done();
            });
    });

    it('should return a json list', function(done) {
        request(app)
            .get('/bytes')
            .set('Accept', 'application/json')
            .end(function(err, resp) {
                chai.expect(resp.statusCode).to.equal(200);
                chai.expect(resp.header['content-type']).to.include('application/json');
                chai.expect(resp.body).to.eql(
                    ['.git', '.idea', 'api', 'app.js', 'appsetup.js', 'bin', 'main.js', 'node_modules', 'package-lock.json', 'package.json', 'pytest', 'routes', 'test', 'watcher.js']
                );
                done();
            });
    });

    after(function() {
        // manually stop the filesystem watcher
        request(app)
            .get('/files/close')
            .end(function(err,resp){
                chai.expect(resp.statusCode).to.equal(200);
                if (typeof done !== 'undefined') {
                    done();
                }
            });
    });
});