import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import auth from './../../config/auth';
import Poll from './../../../models/poll';
let app = require('./../../../index');
let server;
let pollId = '123456';

describe('DELETE /api/polls/:pollId', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token, pollId) => chai.request(server).delete(`/api/polls/${pollId}`).set('Authorization', token);

    it('it should NOT delete poll without authorization', (done) => {
        callApi('', pollId)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'No auth token.');
                done();
            });
    });
    it('it should NOT delete poll without poll ID', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token)
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Poll ID is needed.');
                    done();
                });
        });
    });
    it('it should NOT delete poll with wrong poll ID', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token, pollId)
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, `Poll with ID ${pollId} cannot be found.`);
                    done();
                });
        });
    });
    it('it should delete poll', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            Poll.findOne({ title: 'New Poll'}, (err, poll) => {
                assert.equal(err, null);
                pollId = poll._id;
                callApi(res.body.token, pollId)
                    .end((err, res) => {
                        assert.equal(err, null);
                        assert.equal(res.status, 200);
                        assert.equal(res.body.message, 'The poll deleted successfully.');
                        Poll.findOne({ _id: pollId }, (err, poll) => {
                            assert.equal(err, null);
                            assert.equal(poll, null);
                            done();
                        });
                    });
            });
        });
    });
});