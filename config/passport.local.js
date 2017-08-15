import { Strategy as LocalStrategy } from 'passport-local';
import User from './../models/user';

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const register = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        process.nextTick(() => {
            if (!req.body.firstName || !req.body.lastName) {
                return done(null, false, { message: 'You must enter your full name.' });
            }
            if (!validateEmail(email)) {
                return done(null, false, { message: 'You must enter a valid email address.' });
            }

            User.findOne({ 'local.email': email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, { message: 'The email address is already taken. Please use a different one.' });
                }
                else {
                    let newUser = new User();

                    newUser.local.email    = email;
                    newUser.local.firstName = req.body.firstName;
                    newUser.local.lastName = req.body.lastName;
                    newUser.generateHash(password, (error, hash) => {
                        if (error) {
                            return done(error);
                        }
                        newUser.local.password = hash;
                    });

                    newUser.save(err => {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }
);

export const login = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },
    (email, password, done) => {
        process.nextTick(() => {
            User.findOne({ 'local.email' :  email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Your login details could not be verified. Please try again.' });
                }
                user.comparePassword(password, user.local.password, (error, isMatch) => {
                    if (error || !isMatch) {
                        return done(null, false, { message: 'Either email or password is not correct.' });
                    }
                    return done(null, user);
                });
            });
        });
    }
);