import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import _ from 'lodash';
import auth from './../../config/auth';
let app = require('./../../../index');
let server;
let newPoll = {
    title: 'New Poll',
    options: ['Option 1', 'Option 2']
};

describe('POST /api/polls', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token) => chai.request(server).post('/api/polls').set('Authorization', token);

    it('it should NOT add new poll without authorization', (done) => {
        chai.request(server).post('/api/polls')
            .send(newPoll)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'No auth token.');
                done();
            });
    });
    it('it should NOT add new poll with invalid token', (done) => {
        callApi('123456')
            .send(newPoll)
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'No auth token.');
                done();
            });
    });
    it('it should NOT add new poll without title', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token)
                .send({ options: newPoll.options })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Please enter a title.');
                    done();
                });
        });
    });
    it('it should NOT add new poll without options', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token)
                .send({ title: newPoll.title })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Please enter 2 or more options.');
                    done();
                });
        });
    });
    it('it should NOT add new poll with less than 2 options', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token)
                .send({
                    title: newPoll.title,
                    options: [newPoll.options[0]]
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Please enter 2 or more options.');
                    done();
                });
        });
    });
    it('it should add new poll', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            let userId = res.body.user.id;
            assert.equal(err, null);
            callApi(res.body.token)
                .send(newPoll)
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'New poll has been created.');

                    let poll = res.body.poll;
                    assert.equal(poll.title, newPoll.title);
                    _.forEach(poll.options, (option, idx) => {
                        assert.equal(option.name, newPoll.options[idx]);
                        assert.equal(option.vote, 0);
                    });
                    assert.equal(poll.author, userId);
                    assert.typeOf(poll.votedBy, 'array');
                    assert.lengthOf(poll.votedBy, 0);
                    done();
                });
        });
    });
});