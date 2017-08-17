import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import auth from './../../config/auth';
let app = require('./../../../index');
let server;
let pollId = '598eaf0a2e107c03d517d783';
let wrongPollId = '123456';

describe('GET /api/polls/:pollId', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (pollId) => chai.request(server).get(`/api/polls/${pollId}`);

    it('it should NOT get single poll without poll ID', (done) => {
        callApi()
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Poll ID is needed.');
                done();
            });
    });
    it('it should NOT get single poll with wrong poll ID', (done) => {
        callApi(wrongPollId)
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, `Poll with ID ${wrongPollId} cannot be found.`);
                done();
            });
    });
    it('it should get single poll', (done) => {
        callApi(pollId)
            .end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.equal(res.body.poll._id, pollId);
                done();
            });
    });
});