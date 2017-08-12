import chai from 'chai';
import chaiHttp from 'chai-http';
import {describe, beforeEach, afterEach, it} from 'mocha';
let assert = chai.assert;
chai.use(chaiHttp);

import mongoose from 'mongoose';
import Poll from './../../models/poll';
import core from './../utils/core';
let app = require('./../../index');
let server;

describe('Polls', () => {
    beforeEach((done) => {
        server = app.listen();
        Poll.remove({}, (err) => {
            done();
        });
    });

    afterEach((done) => {
        server.close(done);
    });

    describe('GET /polls', () => {
        it('it should GET all the polls', (done) => {
            chai.request(server)
                .get(core.path('/polls'))
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 200);
                    assert.typeOf(res.body.polls, 'array', 'returns an array of polls');
                    assert.lengthOf(res.body.polls, 0, 'returns no polls');
                    done();
                });
        });
    });

});