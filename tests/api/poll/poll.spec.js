import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

let server = require('./../../../index');

describe('Poll', () => {
    afterEach(done => {
        server.close(done);
    });

    describe('GET /api/polls', () => {
        it('it should GET all the polls', (done) => {
            chai.request(server).get('/api/polls')
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