import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = chai.assert;
chai.use(chaiHttp);
import {describe, beforeEach, afterEach, it} from 'mocha';

import auth from './../config/auth';
import { ROLE_MEMBER } from './../../constants';
let app = require('./../../index');
let newUser = {
    email: 'leonardo_taha@yahoo.com',
    firstName: 'Leonardo',
    lastName: 'Taha',
    password: '111111'
};

describe('users', () => {
    describe('POST /api/auth/register', () => {
        it('it should NOT register without firstName or lastName', (done) => {
            chai.request(app).post('/api/auth/register')
                .send({ email: newUser.email, password: newUser.password })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'You must enter your full name.');
                    done();
                }
            );
        });
        it('it should NOT register without email or password', (done) => {
            chai.request(app).post('/api/auth/register')
                .send({ firstName: newUser.firstName, lastName: newUser.lastName })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Missing credentials');
                    done();
                }
            );
        });
        it('it should NOT register with invalid email address', (done) => {
            chai.request(app).post('/api/auth/register')
                .send({ firstName: newUser.firstName, lastName: newUser.lastName, email: 'invalidemail', password: newUser.password })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'You must enter a valid email address.');
                    done();
                }
            );
        });
        it('it should NOT register with an existing email address', (done) => {
            chai.request(app).post('/api/auth/register')
                .send({ firstName: newUser.firstName, lastName: newUser.lastName, email: 'localtest@hotmail.com', password: newUser.password })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'The email address is already taken. Please use a different one.');
                    done();
                }
            );
        });
        it('it should register', (done) => {
            chai.request(app).post('/api/auth/register')
                .send(newUser)
                .end((err, res) => {
                    assert.equal(err, null);
                    assert.equal(res.status, 201);

                    let user = res.body.user;
                    assert.equal(user.email, newUser.email);
                    assert.equal(user.name, newUser.firstName + ' ' + newUser.lastName);
                    assert.equal(user.role, ROLE_MEMBER);
                    done();
                }
            );
        });
    });

    describe('POST /api/auth/login', () => {
        it('it should NOT login without email or password', (done) => {
            auth.loginAsUser(app, {}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Missing credentials')
                done();
            });
        });
        it('it should NOT login with incorrect email', (done) => {
            auth.loginAsUser(app, { email: 'wrongemail@yahoo.com', password: newUser.password }).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Your login details could not be verified. Please try again.');
                done();
            });
        });
        it('it should NOT login with incorrect password', (done) => {
            auth.loginAsUser(app, { email: newUser.email, password: '000000' }).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Either email or password is not correct.');
                done();
            });
        });
        it('it should login', (done) => {
            auth.loginAsUser(app, newUser).end((err, res) => {
                assert.equal(err, null);
                assert.equal(res.status, 200);

                let user = res.body.user;
                assert.equal(user.email, newUser.email);
                assert.equal(user.name, newUser.firstName + ' ' + newUser.lastName);
                assert.equal(user.role, ROLE_MEMBER);
                done();
            });
        });
    });
});