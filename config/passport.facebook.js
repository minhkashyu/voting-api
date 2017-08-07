import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from './../models/user';
import configAuth from './auth';

const facebook = new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ['id', 'emails', 'first_name', 'last_name', 'gender']
    },
    // facebook will send back the token and profile
    (token, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user); // user found, return that user
                }
                else {
                    let newUser = new User();

                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

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

export default facebook;