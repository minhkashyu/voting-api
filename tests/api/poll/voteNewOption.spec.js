import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import _ from 'lodash';
import auth from './../../config/auth';
let app = require('./../../../index');
let server;
let pollId = '598eaf0a2e107c03d517d783';
let optionName = 'New Option';
let wrongPollId = '123456';

describe('POST /api/polls/:pollId/options', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token, pollId) => chai.request(server).post(`/api/polls/${pollId}/options`).set('Authorization', token);

    it('it should NOT vote new option without authorization', (done) => {
        callApi('')
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'No auth token.');
                done();
            });
    });
    it('it should NOT vote new option without poll ID', (done) => {
        auth.loginAsDifferentUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token)
                .send({ name: optionName })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Poll ID is needed.');
                    done();
                });
        });
    });
    it('it should NOT vote new option with wrong poll ID', (done) => {
        auth.loginAsDifferentUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token, wrongPollId)
                .send({ name: optionName })
                .end((err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, `Poll with ID ${wrongPollId} cannot be found.`);
                    done();
                });
        });
    });
    it('it should NOT vote new option without option name', (done) => {
        auth.loginAsDifferentUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token, pollId)
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Option Name is needed.');
                    done();
                });
        });
    });
    it('it should vote new option ', (done) => {
        auth.loginAsDifferentUser(server).end((err, res) => {
            assert.equal(err, null);
            let userId = res.body.user.id;
            let token = res.body.token;
            callApi(token, pollId)
                .send({ name: optionName })
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Vote has been submitted.');

                    let poll = res.body.poll;
                    assert.equal(poll._id, pollId);
                    assert.isOk(_.includes(poll.votedBy, '::ffff:127.0.0.1'));
                    assert.isOk(_.includes(poll.votedBy, userId));

                    let isVoted = false;
                    _.forEach(poll.options, (option) => {
                        if (option.name === optionName) {
                            assert.equal(option.vote, 1);
                            isVoted = true;
                        }
                    });
                    assert.isOk(isVoted);

                    callApi(token, pollId)
                        .send({ name: 'another new option' })
                        .end((err, res) => {
                            assert.equal(res.status, 403);
                            assert.equal(res.body.error, 'You have already submitted a vote for this poll.');
                            done();
                        });
                });
        });
    });
});