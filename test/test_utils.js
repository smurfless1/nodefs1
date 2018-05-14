'use strict';
let controller = require('../api/bytes/byteController');
let chai = require('chai');
let expect = chai.expect;

describe('longest_matching_size', function() {
    it('finds size for 8000', done => {
        expect(controller.longest_matching_size(Buffer.alloc(8000))).to.eql(4000);
        done();
    });
    it('finds size for 3999', done => {
        expect(controller.longest_matching_size(Buffer.alloc(3999))).to.eql(2000);
        done();
    });
    it('finds size for 1601', done => {
        expect(controller.longest_matching_size(Buffer.alloc(1601))).to.eql(1600);
        done();
    });
    it('finds size for   20', done => {
        expect(controller.longest_matching_size(Buffer.alloc(20))).to.eql(20);
        done();
    });
    it('finds size for   21', done => {
        expect(controller.longest_matching_size(Buffer.alloc(21))).to.eql(20);
        done();
    });
    it('finds size for 1', done => {
        expect(controller.longest_matching_size(Buffer.alloc(1))).to.eql(1);
        done();
    });
    /*
    TODO This is not currently working, despite the documentation
    http://www.chaijs.com/api/bdd/
    it('throws for 0', done => {
        let thrownerror = new Error('input of size 0 will not hash');
        expect(controller.longest_matching_size(Buffer.alloc(0))).to.throw(thrownerror);
        done();
    });
    */
});