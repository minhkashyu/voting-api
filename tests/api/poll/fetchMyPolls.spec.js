import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import auth from './../../config/auth';
let app = require('./../../../index');
let server;

describe('GET /api/polls/my', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token) => chai.request(server).get('/api/polls/my').set('Authorization', token);

    it('it should NOT get my polls without authorization', (done) => {
        callApi('')
            .end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'No auth token.');
                done();
            });
    });
    it('it should get my polls', (done) => {
        auth.loginAsRegisteredUser(server).end((err, res) => {
            assert.equal(err, null);
            callApi(res.body.token)
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 200);

                    let polls = res.body.polls;
                    assert.typeOf(polls, 'array');
                    assert.lengthOf(polls, 1);
                    assert.equal(polls[0]._id, '598eaf0a2e107c03d517d783');
                    done();
                });
        });
    });
});