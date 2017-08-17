import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import _ from 'lodash';
import auth from './../../config/auth';
let app = require('./../../../index');
let server;
let pollId = '598eb3442e107c03d517d789';
let optionId = '598eb3442e107c03d517d78b';
let wrongPollId = '123456';
let wrongOptionId = '12345678';
let vote = 2536;

describe.only('POST /api/polls/:pollId/options/:optionId/vote', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (pollId, optionId) => chai.request(server).post(`/api/polls/${pollId}/options/${optionId}/vote`);

    it('it should NOT vote without poll ID', (done) => {
        callApi(null, optionId)
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Poll ID is needed.');
                done();
            });
    });
    it('it should NOT vote with wrong poll ID', (done) => {
        callApi(wrongPollId, optionId)
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, `Poll with ID ${wrongPollId} cannot be found.`);
                done();
            });
    });
    it('it should NOT vote without option ID', (done) => {
        callApi(pollId)
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Option ID is needed.');
                done();
            });
    });
    it('it should NOT vote with wrong option ID', (done) => {
        callApi(pollId, wrongOptionId)
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Option ID is not correct.');
                done();
            });
    });
    it('it should vote without user ID (without login)', (done) => {
        callApi(pollId, optionId)
            .end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Vote has been submitted.');

                let poll = res.body.poll;
                assert.equal(poll._id, pollId);
                assert.isOk(_.includes(poll.votedBy, '::ffff:127.0.0.1'));

                let isVoted = false;
                _.forEach(poll.options, (option) => {
                    if (option._id === optionId) {
                        assert.equal(option.vote, ++vote);
                        isVoted = true;
                    }
                });
                assert.isOk(isVoted);

                callApi(pollId, optionId)
                    .end((err, res) => {
                        assert.equal(res.status, 403);
                        assert.equal(res.body.error, 'You have already submitted a vote for this poll.');
                        done();
                    });
            });
    });
    it('it should vote with user ID (after login)', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            let userId = res.body.user.id;
            callApi(pollId, optionId).send({ userId: userId })
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Vote has been submitted.');

                    let poll = res.body.poll;
                    assert.equal(poll._id, pollId);
                    assert.isOk(_.includes(poll.votedBy, userId));

                    let isVoted = false;
                    _.forEach(poll.options, (option) => {
                        if (option._id === optionId) {
                            assert.equal(option.vote, ++vote);
                            isVoted = true;
                        }
                    });
                    assert.isOk(isVoted);

                    callApi(pollId, optionId).send({ userId: userId })
                        .end((err, res) => {
                            assert.equal(res.status, 403);
                            assert.equal(res.body.error, 'You have already submitted a vote for this poll.');
                            done();
                        });
                });
        });
    });
});