import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import jwt from 'jsonwebtoken';
import config from './../../../config/main';
import auth from './../../config/auth';
import user from './../../config/user';
let app = require('./../../../index');
let server;
let registeredUser = user.registeredUser();

describe('POST /api/auth/login', () => {
    beforeEach(done => {
        server = app.server;
        done();
    });

    afterEach(done => {
        server.close(done);
    });

    it('it should NOT login without email or password', (done) => {
        auth.loginAsUser(server, {}).end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.body.error, 'Missing credentials');
            done();
        });
    });
    it('it should NOT login with incorrect email', (done) => {
        auth.loginAsUser(server, {
            email: 'wrongemail@yahoo.com',
            password: registeredUser.local.password
        }).end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.body.error, 'Your login details could not be verified. Please try again.');
            done();
        });
    });
    it('it should NOT login with incorrect password', (done) => {
        auth.loginAsUser(server, {
            email: registeredUser.local.email,
            password: '000000'
        }).end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.body.error, 'Either email or password is not correct.');
            done();
        });
    });
    it('it should login', (done) => {
        auth.loginAsUser(server, registeredUser.local).end((err, res) => {
            assert.equal(err, null);
            assert.equal(res.status, 200);

            let user = res.body.user;
            assert.equal(user.email, registeredUser.local.email);
            assert.equal(user.name, registeredUser.local.firstName + ' ' + registeredUser.local.lastName);
            assert.equal(user.role, registeredUser.role);

            let token = res.body.token.replace(/^JWT\s/, '');
            jwt.verify(token, config.secret, (err, payload) => {
                assert.equal(payload.id, user.id);
                assert.equal((payload.exp - payload.iat)/3600, 3);
                done();
            });
        });
    });
});