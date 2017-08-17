import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import helpers from './../../../controllers/user/helpers';
import user from './../../config/user';
let app = require('./../../../index');
let server;
let registeredUser = user.registeredUser();
let resetToken = 'cd7e842fe5f86a6e08217f58dcb2cd13ec21bfdc158e26c835825cab01015436d630479d2d154fce3093ce22b8afb2c8';
let newPassword = '111222';

describe('POST /api/auth/reset-password/:token', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    const callApi = (token) => chai.request(server).post(`/api/auth/reset-password/${token}`);

    it('it should NOT verify token without token', (done) => {
        callApi()
            .send({
                password: newPassword
            })
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Token is needed to verify.');
                done();
            }
        );
    });
    it('it should NOT verify token without password', (done) => {
        callApi(resetToken)
            .end((err, res) => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'A new password is needed.');
                done();
            }
        );
    });
    it('it should NOT verify token with expired or not-existing token', (done) => {
        callApi('cd7e842fe5f86a6e08217f58')
            .send({
                password: newPassword
            })
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Your token has expired. Please reset your password again.');
                done();
            }
        );
    });
    it('it should verify token', (done) => {
        callApi(resetToken)
            .send({
                password: newPassword
            })
            .end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Password is reset successfully. Please login with your new password.');

                helpers.getUserByEmail(registeredUser.email, (err, user) => {
                    assert.equal(err, null);
                    assert.equal(user.local.resetPasswordToken, undefined);
                    assert.equal(user.local.resetPasswordExpires, undefined);

                    user.comparePassword(newPassword, user.local.password, (error, isMatch) => {
                        assert.equal(error, null);
                        assert.equal(isMatch, true);
                        done();
                    });
                });
            }
        );
    });
});