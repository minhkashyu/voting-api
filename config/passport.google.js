import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from './../models/user';
import configAuth from './auth';

const google = new GoogleStrategy({
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL
    },
    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({ 'google.id' : profile.id }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                else {
                    let newUser = new User();

                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    newUser.save(err => {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }
);

export default google;