'use strict';
let app = require('../app');
let request = require('supertest');
let chai = require('chai');
let expect = chai.expect;

// integration tests, until I can find a satisfactory way to do unit tests

describe('files', function() {
    it('should accept connections to the /files router', function(done) {
        request(app)
            .get('/files')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, resp) {  // note to self - this HAPPENS at the end, not ends the call
                chai.expect(resp.id).to.be.undefined;
                chai.expect(resp.statusCode).to.equal(200);
                //console.log(resp.body);
                chai.expect(resp.header['content-type']).to.include('application/json');
                //res.body.should.have.property('').and.to.be.a('number').and.to.match(/regex/);
                done();
            });
    });

    it('should return a json list', function(done) {
        // todo : this didn't fail when the list was incomplete
        request(app)
            .get('/files')
            .set('Accept', 'application/json')
            .expect(['.idea', 'app.js', 'bin', 'main.js', 'node_modules', 'package-lock.json',
                'package.json', 'public', 'routes', 'test', 'watcher.js'])
            .end(function(err, resp) {  // note to self - this HAPPENS at the end, not ends the call
                chai.expect(resp.statusCode).to.equal(200);
                chai.expect(resp.header['content-type']).to.include('application/json');
                done();
            });
    });

    it('should return a filtered json list from a get', function(done) {
        // todo : this didn't fail when the list was incomplete
        request(app)
            .get('/files/pa')
            .set('Accept', 'application/json')
            .expect(['package-lock.json', 'package.json' ])  // todo check length?
            .end(function(err, resp) {  // note to self - this HAPPENS at the end, not ends the call
                chai.expect(resp.statusCode).to.equal(200);
                chai.expect(resp.header['content-type']).to.include('application/json');
                // todo public not in ...
                done();
            });
    });

    it('should return a filtered json list from a post', function(done) {
        // todo : this didn't fail when the list was incomplete
        request(app)
            .post('/files')
            .send('pa')
            .set('Accept', 'application/json')
            .expect(['package-lock.json', 'package.json' ])  // todo check length?
            .end(function(err, resp) {  // note to self - this HAPPENS at the end, not ends the call
                chai.expect(resp.statusCode).to.equal(200);
                chai.expect(resp.header['content-type']).to.include('application/json');
                // todo public not in ...
                done();
            });
    });

    after(function() {
        // manually stop the filesystem watcher
        request(app)
            .get('/files/close')
            .end(function(err,resp){
                chai.expect(resp.statusCode).to.equal(200);
            });
    });
});
