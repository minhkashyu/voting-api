import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

let app = require('./../../index');
let server;

describe('Polls', () => {
    beforeEach((done) => {
        server = app.listen();
        done();
    });

    afterEach((done) => {
        server.close(done);
    });

    describe.skip('GET /api/polls', () => {
        it('it should GET all the polls', (done) => {
            chai.request(server).get('/api/polls')
                .end((err, res) => {
                    console.log(res.body);
                    assert.equal(err, null);
                    assert.equal(res.status, 200);
                    assert.typeOf(res.body.polls, 'array', 'returns an array of polls');
                    assert.lengthOf(res.body.polls, 0, 'returns no polls');
                    done();
                });
        });
    });

    describe('POST /api/auth/register', () => {
        it('it should GET all the polls', (done) => {
            chai.request(server).post('/api/auth/register')
                .send({ email: 'minhvinhta@yahoo.com', firstName: 'Minh', lastName: 'Ta', password: '123456' })
                .end((err, res) => {
                    console.log(res.body);
                    assert.equal(err, null);
                    assert.equal(res.status, 201);
                    done();
                });
        });
    });
});