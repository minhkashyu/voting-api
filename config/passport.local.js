import { Strategy as LocalStrategy } from 'passport-local';
import User from './../models/user';

export const register = new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
        process.nextTick(() => {
            // Return error if full name not provided
            if (!req.body.firstName || !req.body.lastName) {
                return done(null, false, 'You must enter your full name.');
            }

            // Return error if no email provided
            if (!req.body.email) {
                return done(null, false, 'You must enter an email address.');
            }

            // Return error if no password provided
            if (!req.body.password) {
                return done(null, false, 'You must enter a password.');
            }

            User.findOne({ 'local.email':  req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, 'The email address is already taken. Please use a different one.');
                }
                else {
                    let newUser = new User();

                    newUser.local.email    = req.body.email;
                    newUser.local.firstName = req.body.firstName;
                    newUser.local.lastName = req.body.lastName;
                    newUser.generateHash(req.body.password, (error, hash) => {
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
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
        process.nextTick(() => {
            if (!email) {
                return done(null, false, 'You must enter an email address.');
            }
            if (!password) {
                return done(null, false, 'You must enter a password.');
            }
            User.findOne({ 'local.email' :  email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, 'Your login details could not be verified. Please try again.');
                }
                user.comparePassword(password, user.local.password, (error, isMatch) => {
                    if (error || !isMatch) {
                        return done(null, false, 'Either email or password is not correct.');
                    }
                    return done(null, user);
                });
            });
        });
    }
);