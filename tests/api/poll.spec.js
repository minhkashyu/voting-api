import chai from 'chai';
import chaiHttp from 'chai-http';
import {describe, beforeEach, afterEach, it} from 'mocha';
let assert = chai.assert;
chai.use(chaiHttp);

import mongoose from 'mongoose';
import Poll from './../../models/poll';
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
                .get(core.path('/api/polls'))
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 200);
                    assert.typeOf(res.body.polls, 'array', 'returns an array of polls');
                    assert.lengthOf(res.body.polls, 2, 'returns no polls');
                    done();
                });
        });
    });

});