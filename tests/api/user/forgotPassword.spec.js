import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';
import sinon from 'sinon';
import crypto from 'crypto';
import moment from 'moment';

import helpers from './../../../controllers/user/helpers';
import user from './../../config/user';
let app = require('./../../../index');
let server;
let registeredUser = user.registeredUser();
let stubCrypto;
let resetToken = 'cd7e842fe5f86a6e08217f58dcb2cd13ec21bfdc158e26c835825cab01015436d630479d2d154fce3093ce22b8afb2c8';

describe.only('POST /api/auth/forgot-password', () => {
    beforeEach(done => {
        server = app.server;
        done();
        stubCrypto = sinon.stub(crypto, 'randomBytes').callsFake((number, callback) => {
            callback(null, resetToken);
        });
    });

    afterEach(done => {
        server.close(done);
        stubCrypto.restore();
    });

    const callApi = () => chai.request(server).post('/api/auth/forgot-password');

    it('it should NOT reset password without email', (done) => {
        callApi()
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Email address is needed.');
                done();
            }
        );
    });
    it('it should NOT reset password with wrong email', (done) => {
        callApi()
            .send({
                email: 'wrongemail@yahoo.com'
            })
            .end((err, res) => {
                assert.equal(res.status, 422);
                assert.equal(res.body.error, 'Your email can not be processed. Please check it.');
                done();
            }
        );
    });
    it('it should reset password', (done) => {
        let resetPasswordExpires = moment().add(1, 'hours').utc().toDate();
        callApi()
            .send(registeredUser.local)
            .end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Please check your email for the link to reset your password.');

                helpers.getUserByEmail(registeredUser.local.email, (err, user) => {
                    assert.equal(err, null);
                    assert.equal(user.local.resetPasswordToken, resetToken);
                    assert.isOk(user.local.resetPasswordExpires >= resetPasswordExpires);
                    done();
                });
            }
        );
    });
});