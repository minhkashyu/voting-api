import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

let app = require('./../../../index');
let server;

describe('GET /api/polls', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    it('it should GET all polls', (done) => {
        chai.request(server)
            .get('/api/polls')
            .end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.typeOf(res.body.polls, 'array', 'returns an array of polls');
                assert.lengthOf(res.body.polls, 2, 'returns no polls');
                done();
            });
    });
});